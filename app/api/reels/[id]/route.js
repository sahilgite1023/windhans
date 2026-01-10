// app/api/reels/[id]/route.js
// API Route: Delete Reel

import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id } = params
    
    // Find the reel
    const reel = await prisma.reel.findUnique({
      where: { id }
    })
    
    if (!reel) {
      return NextResponse.json(
        { error: 'Reel not found' },
        { status: 404 }
      )
    }
    
    // Check if user owns this reel
    if (reel.userId !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own reels' },
        { status: 403 }
      )
    }
    
    // Extract public ID from Cloudinary URL
    const urlParts = reel.videoUrl.split('/')
    const fileWithExtension = urlParts[urlParts.length - 1]
    const publicId = `reels/${fileWithExtension.split('.')[0]}`
    
    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError)
      // Continue anyway - database cleanup is more important
    }
    
    // Delete from database (likes and comments will cascade delete)
    await prisma.reel.delete({
      where: { id }
    })
    
    return NextResponse.json(
      { message: 'Reel deleted successfully' },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete reel' },
      { status: 500 }
    )
  }
}
