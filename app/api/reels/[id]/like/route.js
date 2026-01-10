// app/api/reels/[id]/like/route.js
// API Route: Like/Unlike Reel

import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const { id: reelId } = params
    
    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_reelId: {
          userId: user.id,
          reelId: reelId
        }
      }
    })
    
    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
      
      return NextResponse.json(
        { message: 'Unliked', liked: false },
        { status: 200 }
      )
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: user.id,
          reelId: reelId
        }
      })
      
      return NextResponse.json(
        { message: 'Liked', liked: true },
        { status: 201 }
      )
    }
    
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json(
      { error: 'Failed to like/unlike reel' },
      { status: 500 }
    )
  }
}
