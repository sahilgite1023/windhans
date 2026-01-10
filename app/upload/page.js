// app/upload/page.js
// Upload Reel Page (Protected)

import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import UploadForm from '@/components/UploadForm'
import Link from 'next/link'

export default async function UploadPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
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
              href="/profile"
              className="text-gray-600 hover:text-primary transition"
            >
              Profile
            </Link>
          </nav>
        </div>
      </header>
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Upload New Reel
        </h1>
        
        <UploadForm />
      </div>
    </div>
  )
}
