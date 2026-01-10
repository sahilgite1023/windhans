// app/api/reels/[id]/comments/route.js
// API Route: Get Comments and Add Comment

import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET comments for a reel
export async function GET(request, { params }) {
  try {
    const { id: reelId } = params
    
    const comments = await prisma.comment.findMany({
      where: { reelId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ comments }, { status: 200 })
    
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST a new comment
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
    const body = await request.json()
    const { text } = body
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment text is required' },
        { status: 400 }
      )
    }
    
    const comment = await prisma.comment.create({
      data: {
        text: text.trim(),
        userId: user.id,
        reelId: reelId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(
      { message: 'Comment added', comment },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Add comment error:', error)
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    )
  }
}
