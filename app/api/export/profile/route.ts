import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Fetch user profile
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const exportData = {
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      profile: {
        fotoProfil: user.profile?.fotoProfil || '',
      },
    };

    if (format === 'txt') {
      // Generate TXT format
      const txt = `PROFIL PENGGUNA
================

Email: ${exportData.email}
Role: ${exportData.role}
Tanggal Daftar: ${new Date(exportData.createdAt).toLocaleString('id-ID')}

INFORMASI PROFIL
================

Foto Profil: ${exportData.profile.fotoProfil || 'Tidak ada'}

Exported at: ${new Date().toLocaleString('id-ID')}`;

      return new NextResponse(txt, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="my-profile-${new Date().toISOString().split('T')[0]}.txt"`,
        },
      });
    }

    // Default: JSON format
    const json = JSON.stringify(exportData, null, 2);
    
    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="my-profile-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    console.error('Export profile error:', error);
    return NextResponse.json(
      { error: 'Failed to export profile: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
