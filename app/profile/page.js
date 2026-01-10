// app/profile/page.js
// Protected Profile Page - Shows user info and their reels

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import LogoutButton from '@/components/LogoutButton'
import ReelCard from '@/components/ReelCard'
import Link from 'next/link'

export default async function ProfilePage() {
  // Check authentication
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Fetch user's reels from database
  const reels = await prisma.reel.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  })
  
  return (
    <div className="min-h-screen bg-lightBg">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/feed" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Wind Hans
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/feed"
              className="text-gray-600 hover:text-primary transition"
            >
              Feed
            </Link>
            <Link
              href="/upload"
              className="text-gray-600 hover:text-primary transition"
            >
              Upload
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      
      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Profile Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {user.name}
              </h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-gray-800">{reels.length}</span>
                  <span className="text-gray-600 ml-1">Reels</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-gray-600 ml-1">Joined</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* User's Reels */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Reels</h2>
        </div>
        
        {reels.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">You haven't posted any reels yet</p>
            <Link
              href="/upload"
              className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Upload Your First Reel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} showDelete={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
