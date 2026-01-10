// components/UploadForm.js
// Video Upload Form Component

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadForm() {
  const router = useRouter()
  const [caption, setCaption] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    
    if (!file) return
    
    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file')
      return
    }
    
    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('Video must be less than 50MB')
      return
    }
    
    setVideoFile(file)
    setError('')
    
    // Create preview
    const url = URL.createObjectURL(file)
    setPreview(url)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!videoFile) {
      setError('Please select a video')
      return
    }
    
    setUploading(true)
    setError('')
    setUploadProgress(0)
    
    try {
      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('caption', caption)
      
      // Simulate upload progress (Cloudinary doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)
      
      const response = await fetch('/api/reels/upload', {
        method: 'POST',
        body: formData,
      })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Upload failed')
        setUploading(false)
        setUploadProgress(0)
        return
      }
      
      // Success! Redirect to feed
      setTimeout(() => {
        router.push('/feed')
        router.refresh()
      }, 500)
      
    } catch (err) {
      console.error('Upload error:', err)
      setError('Something went wrong. Please try again.')
      setUploading(false)
      setUploadProgress(0)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8">
      {/* Video Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Video File
        </label>
        
        {!preview ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">MP4, MOV, AVI (MAX. 50MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        ) : (
          <div className="relative">
            <video
              src={preview}
              controls
              className="w-full rounded-xl"
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null)
                setVideoFile(null)
              }}
              disabled={uploading}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Caption */}
      <div className="mb-6">
        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
          Caption (Optional)
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={uploading}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
          placeholder="Write a caption for your reel..."
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Upload Progress */}
      {uploading && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Uploading...</span>
            <span className="text-sm text-gray-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading || !videoFile}
        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {uploading ? 'Uploading...' : 'Post Reel'}
      </button>
    </form>
  )
}
