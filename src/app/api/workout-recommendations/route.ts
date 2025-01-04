import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function GET() {
  const session = await getAuthSession()
  
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const healthProfile = await db.healthProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!healthProfile) {
      return NextResponse.json({ error: "Health profile not found" }, { status: 404 })
    }

    const recentExerciseLogs = await db.exerciseLog.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Split the prompt into two different focuses
    const prompt1 = `
      Based on the following user data, provide a personalized strength training recommendation:
      Health Profile:
      - Age: ${healthProfile.age}
      - Gender: ${healthProfile.gender}
      - Height: ${healthProfile.height} cm
      - Weight: ${healthProfile.weight} kg
      - Activity Level: ${healthProfile.activityLevel}
      - Weekly Exercise: ${healthProfile.weeklyExercise} times
      - Health Goals: ${healthProfile.healthGoals.join(', ')}

      Recent Exercise History:
      ${recentExerciseLogs.map(log => `
        Date: ${log.date.toISOString().split('T')[0]}
        Type: ${log.type}
        Duration: ${log.duration} minutes
        Intensity: ${log.intensity}
      `).join('\n')}

      Focus on strength training exercises and provide specific, actionable recommendations including:
      1. Specific strength exercises or routines
      2. Sets, reps, and rest periods
      3. Progressive overload suggestions
      4. Safety considerations
      Keep the response concise and well-formatted.
    `

    const prompt2 = `
      Based on the same user profile and exercise history, provide a cardio and flexibility focused recommendation:
      Health Profile:
      - Age: ${healthProfile.age}
      - Gender: ${healthProfile.gender}
      - Height: ${healthProfile.height} cm
      - Weight: ${healthProfile.weight} kg
      - Activity Level: ${healthProfile.activityLevel}
      - Weekly Exercise: ${healthProfile.weeklyExercise} times
      - Health Goals: ${healthProfile.healthGoals.join(', ')}

      Focus on cardio and flexibility exercises and provide specific, actionable recommendations including:
      1. Cardio workout types and durations
      2. Heart rate zones and intensity levels
      3. Stretching routines
      4. Recovery tips
      Keep the response concise and well-formatted.
    `

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    // Generate both recommendations in parallel
    const [result1, result2] = await Promise.all([
      model.generateContent(prompt1),
      model.generateContent(prompt2)
    ])

    const recommendation1 = result1.response.text()
    const recommendation2 = result2.response.text()

    return NextResponse.json({
      recommendation1,
      recommendation2
    })
  } catch (error) {
    console.error('Error generating workout recommendations:', error)
    return NextResponse.json(
      { error: "Failed to generate recommendations" }, 
      { status: 500 }
    )
  }
}
