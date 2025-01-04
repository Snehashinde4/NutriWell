import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getAuthSession()

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const userId = req.nextUrl.searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const healthProfile = await db.healthProfile.findUnique({
      where: { userId: userId },
    })

    if (!healthProfile) {
      return NextResponse.json({ error: "Health profile not found" }, { status: 404 })
    }

    return NextResponse.json(healthProfile)
  } catch (error) {
    console.error('Error fetching health profile:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAuthSession()  

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const userId = session.user.id
    const data = await req.json()

    const healthProfile = await db.healthProfile.upsert({
      where: { userId: userId },
      update: {
        age: data.age,
        height: data.height,
        weight: data.weight,
        gender: data.gender,
        activityLevel: data.activityLevel,
        weeklyExercise: data.weeklyExercise,
        targetWeight: data.targetWeight,
        healthGoals: data.healthGoals,
      },
      create: {
        userId: userId,
        age: data.age,
        height: data.height,
        weight: data.weight,
        gender: data.gender,
        activityLevel: data.activityLevel,
        weeklyExercise: data.weeklyExercise,
        targetWeight: data.targetWeight,
        healthGoals: data.healthGoals,
      },
    })

    return NextResponse.json(healthProfile)
  } catch (error) {
    console.error('Error updating health profile:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

