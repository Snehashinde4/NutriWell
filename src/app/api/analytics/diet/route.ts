import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'

interface DailyTotal {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
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
    const dietaryLogs = await db.dietaryLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate
        }
      },
      include: {
        foodItems: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    // Process the logs to calculate daily totals
    const dailyTotals = dietaryLogs.reduce<DailyTotal[]>((acc, log) => {
      const date = log.date.toISOString().split('T')[0]
      const totals = log.foodItems.reduce((sum, item) => ({
        totalCalories: (sum.totalCalories || 0) + item.calories,
        totalProtein: (sum.totalProtein || 0) + (item.protein || 0),
        totalCarbs: (sum.totalCarbs || 0) + (item.carbs || 0),
        totalFats: (sum.totalFats || 0) + (item.fats || 0),
      }), { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 })

      acc.push({
        date,
        ...totals
      })
      return acc
    }, [])

    return NextResponse.json(dailyTotals)
  } catch (error) {
    console.error('Error fetching dietary data:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
