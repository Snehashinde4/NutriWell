import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getAuthSession } from '@/lib/auth/utils'
import { db } from '@/lib/db'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

interface NutritionInfo {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const foodInput = formData.get('foodInput')
    const inputType = formData.get('inputType')
    const mealType = formData.get('mealType') as string

    if (!foodInput || !inputType || !mealType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let nutritionResponse
    let fileName = ''

    if (inputType === 'image') {
      const imageFile = foodInput as File
      const imageData = await imageFile.arrayBuffer()
      const base64Image = Buffer.from(imageData).toString('base64')
      
      // Get and clean up filename
      fileName = imageFile.name
        .replace(/\.[^/.]+$/, '') // Remove file extension
        .replace(/[-_]/g, ' ')    // Replace dashes and underscores with spaces
        .trim()

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      
      const result = await model.generateContent([
        "Analyze this food image and provide nutritional information in JSON format. If you can identify the food, respond with detailed nutrition facts. If you cannot identify the food, respond with null.",
        {
          inlineData: {
            data: base64Image,
            mimeType: imageFile.type
          }
        }
      ])
      nutritionResponse = result.response.text()

      // Check if the image recognition failed or returned null/unknown values
      const parsedResponse = parseNutritionInfo(nutritionResponse)
      if (isNullOrUnknownNutrition(parsedResponse)) {
        // If image recognition failed, use the filename to get nutrition info
        const textModel = genAI.getGenerativeModel({ model: "gemini-pro" })
        const textPrompt = `
          Provide detailed nutritional information for "${fileName}" in this exact JSON format:
          {
            "foodName": "${fileName}",
            "servingSize": "standard serving size",
            "nutritionalInfo": {
              "calories": number,
              "protein": number (in grams),
              "carbs": number (in grams),
              "fats": number (in grams)
            }
          }
          Provide realistic values based on standard serving sizes. Only respond with the JSON.
        `
        const fallbackResult = await textModel.generateContent(textPrompt)
        nutritionResponse = fallbackResult.response.text()
      }
    } else {
      // Text-based lookup remains the same
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })
      const result = await model.generateContent(`
        Provide nutritional information for "${foodInput}" in this exact JSON format:
        {
          "foodName": "${foodInput}",
          "servingSize": "standard serving size",
          "nutritionalInfo": {
            "calories": number,
            "protein": number (in grams),
            "carbs": number (in grams),
            "fats": number (in grams)
          }
        }
        Only respond with the JSON.
      `)
      nutritionResponse = result.response.text()
    }

    const parsedInfo = parseNutritionInfo(nutritionResponse)

    // Rest of your database operations...
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingLog = await db.dietaryLog.findFirst({
      where: {
        userId: session.user.id,
        mealType: mealType,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    let dietaryLog
    if (existingLog) {
      dietaryLog = await db.dietaryLog.update({
        where: { id: existingLog.id },
        data: {
          totalCalories: existingLog.totalCalories + parsedInfo.calories,
          foodItems: {
            create: {
              userId: session.user.id,
              foodName: parsedInfo.foodName || fileName, // Use filename as fallback
              calories: parsedInfo.calories,
              protein: parsedInfo.protein,
              carbs: parsedInfo.carbs,
              fats: parsedInfo.fats,
              servingSize: parsedInfo.servingSize,
              aiPredicted: true,
              mealType: mealType,
              imageUrl: inputType === 'image' ? 'URL_TO_STORED_IMAGE' : null,
            }
          }
        },
        include: {
          foodItems: true,
        }
      })
    } else {
      dietaryLog = await db.dietaryLog.create({
        data: {
          userId: session.user.id,
          mealType: mealType,
          totalCalories: parsedInfo.calories,
          date: today,
          foodItems: {
            create: {
              userId: session.user.id,
              foodName: parsedInfo.foodName || fileName, // Use filename as fallback
              calories: parsedInfo.calories,
              protein: parsedInfo.protein,
              carbs: parsedInfo.carbs,
              fats: parsedInfo.fats,
              servingSize: parsedInfo.servingSize,
              aiPredicted: true,
              mealType: mealType,
              imageUrl: inputType === 'image' ? 'URL_TO_STORED_IMAGE' : null,
            }
          }
        },
        include: {
          foodItems: true,
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      dietaryLog,
      nutritionInfo: parsedInfo,
      source: isNullOrUnknownNutrition(parsedInfo) ? 'filename' : 'image'
    })

  } catch (error) {
    console.error('Error in food recognition:', error)
    return NextResponse.json({ 
      error: "Failed to process food information" 
    }, { status: 500 })
  }
}

function isNullOrUnknownNutrition(info: NutritionInfo): boolean {
  return (
    info.foodName.toLowerCase().includes('unknown') ||
    info.calories === 0 ||
    (info.protein === 0 && info.carbs === 0 && info.fats === 0)
  )
}

function parseNutritionInfo(info: string): NutritionInfo {
  try {
    const data = JSON.parse(info)
    
    return {
      foodName: data.foodName,
      servingSize: data.servingSize,
      calories: Math.round(data.nutritionalInfo.calories),
      protein: Number(data.nutritionalInfo.protein.toFixed(1)),
      carbs: Number(data.nutritionalInfo.carbs.toFixed(1)),
      fats: Number(data.nutritionalInfo.fats.toFixed(1)),
    }
  } catch (error) {
    // Fallback regex parsing
    const calories = parseInt(info.match(/calories:?\s*(\d+)/i)?.[1] || '0')
    const protein = parseFloat(info.match(/protein:?\s*([\d.]+)/i)?.[1] || '0')
    const carbs = parseFloat(info.match(/carbs:?\s*([\d.]+)/i)?.[1] || '0')
    const fats = parseFloat(info.match(/fats:?\s*([\d.]+)/i)?.[1] || '0')
    const foodName = info.match(/food item:?\s*([^,\n]+)/i)?.[1] || 'Unknown Food'
    const servingSize = info.match(/serving size:?\s*([^,\n]+)/i)?.[1] || 'standard serving'

    return {
      foodName,
      servingSize,
      calories: Math.round(calories),
      protein: Number(protein.toFixed(1)),
      carbs: Number(carbs.toFixed(1)),
      fats: Number(fats.toFixed(1)),
    }
  }
}
