import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getAuthSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const url = new URL(req.url)
  const date = url.searchParams.get('date')

  try {
    // If date is provided, fetch detailed logs for that specific date
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)

      const detailedLog = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          dietaryLogs: {
            where: {
              date: {
                gte: startDate,
                lt: endDate,
              },
            },
            select: {
              id: true,
              mealType: true,
              totalCalories: true,
              foodItems: {
                select: {
                  id: true,
                  foodName: true,
                  calories: true,
                  protein: true,
                  carbs: true,
                  fats: true,
                },
              },
            },
          },
          exerciseLogs: {
            where: {
              date: {
                gte: startDate,
                lt: endDate,
              },
            },
            select: {
              id: true,
              type: true,
              duration: true,
              intensity: true,
              caloriesBurned: true,
              notes: true,
            },
          },
        },
      })

      if (!detailedLog) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json({
        date,
        dietaryLogs: detailedLog.dietaryLogs,
        exerciseLogs: detailedLog.exerciseLogs,
      })
    }

    // If no date provided, fetch overview of all logs
    const dailyLogs = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        dietaryLogs: {
          select: {
            id: true,
            date: true,
            mealType: true,
            totalCalories: true,
          },
        },
        exerciseLogs: {
          select: {
            id: true,
            date: true,
            type: true,
            duration: true,
            caloriesBurned: true,
          },
        },
      },
    })

    if (!dailyLogs) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const combinedLogs = [
      ...dailyLogs.dietaryLogs.map(log => ({ ...log, logType: 'dietary' })),
      ...dailyLogs.exerciseLogs.map(log => ({ ...log, logType: 'exercise' })),
    ]

    const groupedLogs = combinedLogs.reduce((acc, log) => {
      const date = log.date.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, dietaryLogs: [], exerciseLogs: [] }
      }
      if (log.logType === 'dietary') {
        acc[date].dietaryLogs.push(log)
      } else {
        acc[date].exerciseLogs.push(log)
      }
      return acc
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as Record<string, any>)

    return NextResponse.json(Object.values(groupedLogs))
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
