// app/api/reels/upload/route.js
// API Route: Upload Reel Video to Cloudinary

import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const formData = await request.formData()
    const video = formData.get('video')
    const caption = formData.get('caption') || ''
    
    if (!video) {
      return NextResponse.json(
        { error: 'Video file is required' },
        { status: 400 }
      )
    }
    
    // Convert video to buffer for Cloudinary upload
    const bytes = await video.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Upload to Cloudinary using upload stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'reels',
          transformation: [
            { width: 720, crop: 'limit' }, // Limit width for performance
            { quality: 'auto' },
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      
      uploadStream.end(buffer)
    })
    
    // Save reel to database
    const reel = await prisma.reel.create({
      data: {
        videoUrl: uploadResult.secure_url,
        caption: caption,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })
    
    return NextResponse.json(
      {
        message: 'Reel uploaded successfully',
        reel
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    )
  }
}
