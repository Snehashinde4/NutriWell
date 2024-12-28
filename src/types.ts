export type HealthProfile = {
  age: number
  height: number
  weight: number
  gender: string | null
  activityLevel: string
  weeklyExercise: number
  targetWeight: number | null
  bmi: number | null
  healthGoals: string[]
  createdAt: Date
}

export type UpdateProfileResponse = {
  success: boolean
  data?: HealthProfile
  error?: string
}

