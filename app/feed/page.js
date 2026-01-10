// app/feed/page.js
// Main Reels Feed Page (Protected)

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import ReelFeedItem from '@/components/ReelFeedItem'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default async function FeedPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Fetch all reels with likes and comments
  const reels = await prisma.reel.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      },
      likes: {
        select: {
          userId: true
        }
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          likes: true,
          comments: true
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
              href="/upload"
              className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Upload
            </Link>
            <Link
              href="/profile"
              className="text-gray-600 hover:text-primary transition font-medium"
            >
              Profile
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      
      {/* Feed */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Reels Feed
        </h1>
        
        {reels.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">No reels yet. Be the first to post!</p>
            <Link
              href="/upload"
              className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Upload Reel
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {reels.map((reel) => (
              <ReelFeedItem key={reel.id} reel={reel} currentUserId={user.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
