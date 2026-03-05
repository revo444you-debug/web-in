import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Fetch all users with profiles
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const exportData = users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      nama: user.profile?.nama || '',
      nim: user.profile?.nim || '',
      prodi: user.profile?.prodi || '',
      angkatan: user.profile?.angkatan || '',
      nomorTelepon: user.profile?.nomorTelepon || '',
    }));

    if (format === 'csv') {
      // Generate CSV
      const headers = ['ID', 'Email', 'Role', 'Created At', 'Nama', 'NIM', 'Prodi', 'Angkatan', 'Nomor Telepon'];
      const csvRows = [
        headers.join(','),
        ...exportData.map(user => [
          user.id,
          `"${user.email}"`,
          user.role,
          user.createdAt,
          `"${user.nama}"`,
          `"${user.nim}"`,
          `"${user.prodi}"`,
          `"${user.angkatan}"`,
          `"${user.nomorTelepon}"`,
        ].join(','))
      ];

      const csv = csvRows.join('\n');
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Default: JSON format
    const json = JSON.stringify(exportData, null, 2);
    
    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Export users error:', error);
    return NextResponse.json(
      { error: 'Failed to export users: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
