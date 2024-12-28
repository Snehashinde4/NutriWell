'use server'

import { z } from "zod"
import { HealthProfile, UpdateProfileResponse } from "@/types"
import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/auth/utils"

const profileSchema = z.object({
  age: z.number(),
  height: z.number(),
  weight: z.number(),
  gender: z.string().nullable(),
  activityLevel: z.string(),
  weeklyExercise: z.number(),
  targetWeight: z.number().nullable(),
  healthGoals: z.array(z.string()),
})

export async function UpdateProfile(
  data: z.infer<typeof profileSchema>
): Promise<UpdateProfileResponse> {
  try {
    const session = await getAuthSession()
    
    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Calculate BMI
    const bmi = data.weight / Math.pow(data.height / 100, 2)

    const healthProfile = await db.healthProfile.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        age: data.age,
        height: data.height,
        weight: data.weight,
        gender: data.gender,
        activityLevel: data.activityLevel,
        weeklyExercise: data.weeklyExercise,
        bmi: parseFloat(bmi.toFixed(2)),
        targetWeight: data.targetWeight,
        healthGoals: data.healthGoals,
      },
      create: {
        userId: session.user.id,
        age: data.age,
        height: data.height,
        weight: data.weight,
        gender: data.gender,
        activityLevel: data.activityLevel,
        weeklyExercise: data.weeklyExercise,
        bmi: parseFloat(bmi.toFixed(2)),
        targetWeight: data.targetWeight,
        healthGoals: data.healthGoals,
      },
    })

    return { 
      success: true, 
      data: healthProfile 
    }
  } catch (error) {
    console.error('Error in UpdateProfile:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile' 
    }
  }
}

export async function GetProfile(){
  try {
    const session = await getAuthSession()
    
    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized', status: 401 }
    }

    const healthProfile = await db.healthProfile.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    return healthProfile
  } catch (error) {
    console.error('Error in GetProfile:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get profile' 
    }
  }
}
