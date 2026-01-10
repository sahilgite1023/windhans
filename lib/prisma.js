// lib/prisma.js
// This creates a single Prisma client instance to reuse across the app
// Prevents creating too many database connections in development

import { PrismaClient } from '@prisma/client'

// Use a global variable to store the Prisma client in development
// This prevents hot-reloading from creating new connections
const globalForPrisma = global

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
