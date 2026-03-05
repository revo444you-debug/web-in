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

    // Get prodi distribution - handle potential null values
    let prodiDistribution = [];
    try {
      const prodiData = await prisma.profile.groupBy({
        by: ['prodi'],
        _count: {
          prodi: true,
        },
        where: {
          prodi: {
            not: null,
            not: '',
          },
        },
      });
      prodiDistribution = prodiData;
    } catch (error) {
      console.log('Prodi distribution error:', error);
    }

    // Get angkatan distribution - handle potential null values
    let angkatanDistribution = [];
    try {
      const angkatanData = await prisma.profile.groupBy({
        by: ['angkatan'],
        _count: {
          angkatan: true,
        },
        where: {
          angkatan: {
            not: null,
            not: '',
          },
        },
        orderBy: {
          angkatan: 'desc',
        },
      });
      angkatanDistribution = angkatanData;
    } catch (error) {
      console.log('Angkatan distribution error:', error);
    }

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
      distributions: {
        byProdi: prodiDistribution.map(item => ({
          prodi: item.prodi || 'Tidak diisi',
          count: item._count.prodi,
        })),
        byAngkatan: angkatanDistribution.map(item => ({
          angkatan: item.angkatan || 'Tidak diisi',
          count: item._count.angkatan,
        })),
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
