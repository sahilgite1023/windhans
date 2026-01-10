// components/ReelFeedItem.js
// Reel Feed Item Component (for vertical feed)

'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export default function ReelFeedItem({ reel, currentUserId }) {
  const router = useRouter()
  const videoRef = useRef(null)
  const clickTimeoutRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(reel.likes.some(like => like.userId === currentUserId))
  const [likesCount, setLikesCount] = useState(reel._count.likes)
  const [commentsCount, setCommentsCount] = useState(reel._count.comments)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(reel.comments || [])
  const [newComment, setNewComment] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play()
          setIsPlaying(true)
        } else if (videoRef.current) {
          videoRef.current.pause()
          setIsPlaying(false)
        }
      },
      { threshold: 0.7 }
    )
    
    if (videoRef.current) {
      observer.observe(videoRef.current)
    }
    
    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current)
      }
    }
  }, [])
  
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return
    
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])
  
  const handleDoubleTapLike = useCallback(async () => {
    // Show heart animation
    setShowHeartAnimation(true)
    setTimeout(() => setShowHeartAnimation(false), 800)
    
    // Like the reel if not already liked
    if (!isLiked) {
      try {
        const response = await fetch(`/api/reels/${reel.id}/like`, {
          method: 'POST'
        })
        
        if (response.ok) {
          const data = await response.json()
          setIsLiked(data.liked)
          setLikesCount(prev => data.liked ? prev + 1 : prev - 1)
        }
      } catch (error) {
        console.error('Like error:', error)
      }
    }
  }, [isLiked, reel.id])
  
  const handleVideoClick = useCallback((e) => {
    e.preventDefault()
    
    // Clear existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
      clickTimeoutRef.current = null
      // Double click detected
      handleDoubleTapLike()
    } else {
      // Single click - wait to see if it's a double click
      clickTimeoutRef.current = setTimeout(() => {
        togglePlayPause()
        clickTimeoutRef.current = null
      }, 250)
    }
  }, [togglePlayPause, handleDoubleTapLike])
  
  const handleLike = useCallback(async () => {
    try {
      const response = await fetch(`/api/reels/${reel.id}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        setLikesCount(prev => data.liked ? prev + 1 : prev - 1)
      }
    } catch (error) {
      console.error('Like error:', error)
    }
  }, [reel.id])
  
  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    try {
      const response = await fetch(`/api/reels/${reel.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment })
      })
      
      if (response.ok) {
        const data = await response.json()
        setComments([data.comment, ...comments])
        setCommentsCount(prev => prev + 1)
        setNewComment('')
      }
    } catch (error) {
      console.error('Comment error:', error)
    }
  }
  
  const handleDelete = async () => {
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
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* User Info */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
            {reel.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{reel.user.name}</h3>
            <p className="text-xs text-gray-500" suppressHydrationWarning>
              {new Date(reel.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Delete button (only for owner) */}
        {currentUserId === reel.userId && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
            title="Delete reel"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Video */}
      <div className="relative bg-gray-900">
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="w-full max-h-[600px] object-contain cursor-pointer select-none"
          onClick={handleVideoClick}
          loop
          muted
          playsInline
        />
        
        {/* Double-tap Heart Animation */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="animate-[ping_0.8s_ease-out]">
              <svg
                className="w-32 h-32 text-red-500 drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Play/Pause Indicator */}
        {!isPlaying && isVisible && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <svg className="w-20 h-20 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        )}
      </div>
      
      {/* Caption */}
      {reel.caption && (
        <div className="px-4 pt-4">
          <p className="text-gray-700">{reel.caption}</p>
        </div>
      )}
      
      {/* Like and Comment Buttons */}
      <div className="px-4 py-3 flex items-center gap-6">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 transition hover:scale-110"
        >
          <svg
            className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600'}`}
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-semibold text-gray-700">{likesCount}</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 transition hover:scale-110"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-semibold text-gray-700">{commentsCount}</span>
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t pt-4">
          {/* Comment Input */}
          <form onSubmit={handleComment} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              Post
            </button>
          </form>
          
          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {comment.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <p className="font-semibold text-sm text-gray-800">{comment.user.name}</p>
                      <p className="text-gray-700 text-sm">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-3" suppressHydrationWarning>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
