// components/ReelCard.js
// Reel Card Component (for grid display on profile)

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReelCard({ reel, showDelete = false }) {
  const router = useRouter()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleVideoClick = (e) => {
    const video = e.target
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }
  
  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this reel?')) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/reels/${reel.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete reel')
        setIsDeleting(false)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete reel')
      setIsDeleting(false)
    }
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group">
      <div className="relative aspect-[9/16] bg-gray-100">
        <video
          src={reel.videoUrl}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handleVideoClick}
          loop
        />
        
        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
        
        {/* Delete Button */}
        {showDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition disabled:opacity-50 opacity-0 group-hover:opacity-100"
            title="Delete reel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {reel.caption || 'No caption'}
        </p>
        <p className="text-xs text-gray-400 mt-2" suppressHydrationWarning>
          {new Date(reel.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
