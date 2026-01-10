// lib/auth.js
// Authentication helper functions

import { cookies } from 'next/headers'
import prisma from './prisma'

// Get current logged-in user from session
export async function getCurrentUser() {
  const cookieStore = cookies()
  const userId = cookieStore.get('userId')?.value
  
  if (!userId) {
    return null
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })
    return user
  } catch (error) {
    return null
  }
}

// Check if user is authenticated
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    return { authenticated: false, user: null }
  }
  return { authenticated: true, user }
}
