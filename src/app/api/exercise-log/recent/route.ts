import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getAuthSession()

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const recentExercise = await db.exerciseLog.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: today
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(recentExercise)
  } catch (error) {
    console.error('Error fetching recent exercise:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



