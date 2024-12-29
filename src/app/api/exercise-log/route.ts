import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getAuthSession()

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { type, duration, intensity, caloriesBurned, notes } = await req.json()

    const exerciseLog = await db.exerciseLog.create({
      data: {
        userId: session.user.id,
        type,
        duration,
        intensity,
        caloriesBurned,
        notes,
      },
    })

    return NextResponse.json(exerciseLog)
  } catch (error) {
    console.error('Error creating exercise log:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


