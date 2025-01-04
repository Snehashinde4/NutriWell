'use server'

import { z } from "zod"
import { UpdateProfileResponse } from "@/types"
import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/auth/utils"

const formSchema = z.object({
  age: z.number().min(1, {
    message: "Age must be at least 1.",
  }).max(120, {
    message: "Age must be less than 120.",
  }),
  height: z.number().positive({
    message: "Height must be a positive number.",
  }),
  weight: z.number().positive({
    message: "Weight must be a positive number.",
  }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  activityLevel: z.enum([
    'SEDENTARY',
    'LIGHT',
    'MODERATE',
    'VERY_ACTIVE',
    'EXTREMELY_ACTIVE'
  ]),
  weeklyExercise: z.number().min(0, {
    message: "Weekly exercise cannot be negative.",
  }).max(30, {
    message: "Weekly exercise cannot exceed 30 hours.",
  }).refine((val) => !isNaN(val), {
    message: "Please enter a valid number.",
  }),
  targetWeight: z.number().positive({
    message: "Target weight must be a positive number.",
  }).optional(),
  healthGoals: z.array(z.string()).optional(),
})


export async function UpdateProfile(
  data: z.infer<typeof formSchema>
): Promise<UpdateProfileResponse> {
  try {
    const session = await getAuthSession()
    
    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    console.log(data)
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
