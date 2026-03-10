import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import ProfileForm from './ProfileForm'
import { DownloadButton } from '@/components/ui/download-button'

export default async function ProfilePage() {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  const profile: any = await prisma.profile.findUnique({
    where: { userId: session.userId },
  })

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile Saya</h1>
          <div className="flex gap-2">
            <DownloadButton
              endpoint="/api/export/profile"
              format="json"
              label="Download JSON"
              variant="outline"
            />
            <DownloadButton
              endpoint="/api/export/profile"
              format="txt"
              label="Download TXT"
              variant="outline"
            />
          </div>
        </div>
        
        <ProfileForm 
          profile={profile} 
          userEmail={session.email}
        />
      </div>
    </div>
  )
}
