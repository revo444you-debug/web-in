import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifySession } from '@/lib/session'
import { updateLabelSchema } from '@/lib/validations/message'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { labelId } = updateLabelSchema.parse({
      contactId: id,
      labelId: body.labelId,
    })

    const contact = await prisma.contact.update({
      where: { id },
      data: { labelId },
      include: { label: true },
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Update label error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan' },
      { status: 500 }
    )
  }
}
