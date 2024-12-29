import { NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // 1. Authentication check
    const session = await getAuthSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }


    // 3. Try to find existing health profile
    let healthProfile = await db.healthProfile.findUnique({
      where: { 
        userId: session.user.id,
    },
      select: {
        height: true,
        weight: true,
        bmi: true
      }
    })


    // 4. If no profile exists, create a default one
    if (!healthProfile) {
      try {
        healthProfile = await db.healthProfile.create({
          data: {
            userId: session.user.id,
            height: 170, // default height in cm
            weight: 70,  // default weight in kg
            age: 30,     // default age
            activityLevel: 'MODERATE',
            weeklyExercise: 3,
            healthGoals: [],
          },
          select: {
            height: true,
            weight: true,
            bmi: true
          }
        })
      } catch (error) {
        console.error('Error creating health profile:', error)
        return NextResponse.json(
          { error: "Failed to create health profile" },
          { status: 500 }
        )
      }
    }

    // 5. Calculate BMI if not stored
    const { height, weight } = healthProfile
    const heightInMeters = height / 100
    const bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1))

    // 6. Update the stored BMI if it's different
    if (healthProfile.bmi !== bmi) {
      await db.healthProfile.update({
        where: { userId: session.user.id },
        data: { bmi }
      })
    }


    return NextResponse.json({ bmi })

  } catch (error) {
    console.error('Error in BMI route:', error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
