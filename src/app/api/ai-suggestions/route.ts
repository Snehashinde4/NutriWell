import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const session = await getAuthSession()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { userId, weightGoal } = await req.json()

    if (!weightGoal) {
      return NextResponse.json({ error: "Weight goal is required" }, { status: 400 })
    }

    // Fetch user's health profile
    const healthProfile = await db.healthProfile.findUnique({
      where: { userId: userId },
    })

    if (!healthProfile) {
      return NextResponse.json({ error: "Health profile not found" }, { status: 404 })
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    const bmr = calculateBMR(healthProfile)

    // Fetch user's recent dietary logs (last 7 days)
    const recentDietaryLogs = await db.dietaryLog.findMany({
      where: {
        userId: userId,
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        foodItems: true
      }
    })

    // Calculate average daily calories
    const avgDailyCalories = calculateAverageCalories(recentDietaryLogs)

    // Fetch user's recent exercise logs (last 7 days)
    const recentExerciseLogs = await db.exerciseLog.findMany({
      where: {
        userId: userId,
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    })

    // Calculate average daily calories burned
    const avgCaloriesBurned = calculateAverageCaloriesBurned(recentExerciseLogs)

    // Prepare the prompt for the AI model
    const prompt = `
      As a professional nutritionist and fitness coach, provide personalized suggestions for a user who wants to ${weightGoal} weight. Use the following detailed information:

      Health Profile:
      - Current Weight: ${healthProfile.weight} kg
      - Target Weight: ${healthProfile.targetWeight} kg
      - Height: ${healthProfile.height} cm
      - Age: ${healthProfile.age}
      - Gender: ${healthProfile.gender}
      - Activity Level: ${healthProfile.activityLevel}
      - Weekly Exercise: ${healthProfile.weeklyExercise} times
      - Health Goals: ${healthProfile.healthGoals.join(', ')}
      - Calculated BMR: ${bmr} calories/day

      Current Habits (7-Day Average):
      - Daily Calorie Intake: ${avgDailyCalories} calories
      - Daily Calories Burned: ${avgCaloriesBurned} calories
      
      Recent Diet Patterns:
      ${recentDietaryLogs.map(log => `
        Date: ${log.date.toISOString().split('T')[0]}
        Total Calories: ${log.totalCalories}
        Food Items: ${log.foodItems.map(item => `${item.foodName} (${item.calories} cal)`).join(', ')}
      `).join('\n')}

      Exercise History:
      ${recentExerciseLogs.map(log => `
        Date: ${log.date.toISOString().split('T')[0]}
        Type: ${log.type}
        Duration: ${log.duration} minutes
        Intensity: ${log.intensity}
        Calories Burned: ${log.caloriesBurned}
      `).join('\n')}

      Please provide a comprehensive plan including:
      1. Specific calorie targets for ${weightGoal === 'decrease' ? 'weight loss' : 'weight gain'}
      2. Macro-nutrient distribution (protein, carbs, fats)
      3. Meal timing and frequency recommendations
      4. Specific food suggestions based on their current diet
      5. Exercise routine adjustments (frequency, intensity, types)
      6. Recovery and rest recommendations
      7. Progress tracking metrics
      8. Potential challenges and solutions
      
      Format the response in clear sections with bullet points for easy reading.
    `

    // Generate suggestions using the AI model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const suggestions = result.response.text()

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to calculate BMR using Mifflin-St Jeor Equation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateBMR(profile: any) {
  const { weight, height, age, gender } = profile
  let bmr = (10 * weight) + (6.25 * height) - (5 * age)
  bmr = gender?.toLowerCase() === 'female' ? bmr - 161 : bmr + 5
  return Math.round(bmr)
}

// Helper function to calculate average daily calories
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateAverageCalories(logs: any[]) {
  if (logs.length === 0) return 0
  const totalCalories = logs.reduce((sum, log) => sum + log.totalCalories, 0)
  return Math.round(totalCalories / logs.length)
}

// Helper function to calculate average daily calories burned
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateAverageCaloriesBurned(logs: any[]) {
  if (logs.length === 0) return 0
  const totalCalories = logs.reduce((sum, log) => sum + (log.caloriesBurned || 0), 0)
  return Math.round(totalCalories / logs.length)
}
