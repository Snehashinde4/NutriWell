// app/api/analytics/health/route.ts
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getAuthSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const searchParams = new URL(req.url).searchParams
  const days = parseInt(searchParams.get('days') || '30')
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  try {
    const healthData = await db.healthProfile.findMany({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(healthData)
  } catch (error) {
    console.error('Error fetching health data:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

