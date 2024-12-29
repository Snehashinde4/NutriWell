import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'

interface ExerciseTotal {
  date: string
  caloriesBurned: number
  duration: number
}

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
    const exerciseLogs = await db.exerciseLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Process the logs to calculate daily totals
    const dailyTotals = exerciseLogs.reduce<ExerciseTotal[]>((acc, log) => {
      const date = log.date.toISOString().split('T')[0]
      const existingDay = acc.find(d => d.date === date)
      
      if (existingDay) {
        existingDay.caloriesBurned += log.caloriesBurned || 0
        existingDay.duration += log.duration
      } else {
        acc.push({
          date,
          caloriesBurned: log.caloriesBurned || 0,
          duration: log.duration
        })
      }
      return acc
    }, [])

    return NextResponse.json(dailyTotals)
  } catch (error) {
    console.error('Error fetching exercise data:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
