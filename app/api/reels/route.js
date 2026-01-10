// app/api/reels/route.js
// API Route: Get All Reels

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const reels = await prisma.reel.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      take: 50, // Limit to 50 most recent reels
    })
    
    return NextResponse.json({ reels }, { status: 200 })
    
  } catch (error) {
    console.error('Fetch reels error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reels' },
      { status: 500 }
    )
  }
}
