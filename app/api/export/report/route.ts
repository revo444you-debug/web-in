import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Gather statistics
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({
      where: { role: 'ADMIN' },
    });
    const totalRegularUsers = await prisma.user.count({
      where: { role: 'USER' },
    });
    const totalProfiles = await prisma.profile.count();
    const profilesWithPhoto = await prisma.profile.count({
      where: {
        fotoProfil: {
          not: null,
        },
      },
    });

    // Profile statistics only (no prodi/angkatan since fields don't exist)
    const report = {
      generatedAt: new Date().toISOString(),
      generatedBy: session.email,
      statistics: {
        users: {
          total: totalUsers,
          admins: totalAdmins,
          regularUsers: totalRegularUsers,
        },
        profiles: {
          total: totalProfiles,
          withPhoto: profilesWithPhoto,
          withoutPhoto: totalProfiles - profilesWithPhoto,
          completionRate: totalUsers > 0 ? ((totalProfiles / totalUsers) * 100).toFixed(2) + '%' : '0%',
        },
      },
    };

    const json = JSON.stringify(report, null, 2);
    
    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="system-report-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
