import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/session'
import prisma from '@/lib/prisma'
import CreateUserForm from './CreateUserForm'
import UserList from './UserList'
import { DownloadButton } from '@/components/ui/download-button'

export default async function UsersPage() {
  const session = await verifySession()

  // Only ADMIN can access this page
  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex gap-2">
            <DownloadButton
              endpoint="/api/export/users"
              format="json"
              label="Export JSON"
              variant="outline"
            />
            <DownloadButton
              endpoint="/api/export/users"
              format="csv"
              label="Export CSV"
              variant="outline"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create User Form */}
          <div>
            <CreateUserForm />
          </div>

          {/* User List */}
          <div>
            <UserList users={users} />
          </div>
        </div>
      </div>
    </div>
  )
}
