'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define interfaces for the API responses
interface HealthData {
  id: string
  userId: string
  weight: number
  bmi: number | null
  date: string
  createdAt: string
}

interface DietaryData {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
}

interface ExerciseData {
  date: string
  caloriesBurned: number
  duration: number
}

// Combined data interface for the chart
interface ChartData {
  date: string
  weight?: number
  bmi?: number
  calories?: number
  caloriesBurned?: number
  protein?: number
  carbs?: number
  fats?: number
  exerciseDuration?: number
}

export function AnalyticsChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<string>('30')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const healthResponse = await fetch(`/api/analytics/health?days=${timeRange}`)
      const healthData: HealthData[] = await healthResponse.json()

      const dietResponse = await fetch(`/api/analytics/diet?days=${timeRange}`)
      const dietData: DietaryData[] = await dietResponse.json()

      const exerciseResponse = await fetch(`/api/analytics/exercise?days=${timeRange}`)
      const exerciseData: ExerciseData[] = await exerciseResponse.json()

      const combinedData = processData(healthData, dietData, exerciseData)
      setData(combinedData)
    } catch (err) {
      console.error('Error fetching analytics data:', err)
      setError('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  const processData = (
    healthData: HealthData[], 
    dietData: DietaryData[], 
    exerciseData: ExerciseData[]
  ): ChartData[] => {
    const dateMap = new Map<string, ChartData>()

    healthData.forEach(entry => {
      const date = new Date(entry.createdAt).toISOString().split('T')[0]
      dateMap.set(date, {
        date,
        weight: entry.weight,
        bmi: entry.bmi ?? undefined,
      })
    })

    dietData.forEach(entry => {
      const date = entry.date
      const existing = dateMap.get(date) || { date }
      dateMap.set(date, {
        ...existing,
        calories: entry.totalCalories,
        protein: entry.totalProtein,
        carbs: entry.totalCarbs,
        fats: entry.totalFats,
      })
    })

    exerciseData.forEach(entry => {
      const date = entry.date
      const existing = dateMap.get(date) || { date }
      dateMap.set(date, {
        ...existing,
        caloriesBurned: entry.caloriesBurned,
        exerciseDuration: entry.duration,
      })
    })

    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">{error}</div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select 
          value={timeRange} 
          onValueChange={(value: string) => setTimeRange(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 Days</SelectItem>
            <SelectItem value="30">30 Days</SelectItem>
            <SelectItem value="90">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Weight and BMI Chart */}
          <div className="h-[300px]">
            <h3 className="text-lg font-semibold mb-2">Weight & BMI Trends</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="weight" 
                  name="Weight (kg)" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="bmi" 
                  name="BMI" 
                  stroke="#82ca9d" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Calories Chart */}
          <div className="h-[300px]">
            <h3 className="text-lg font-semibold mb-2">Calorie Balance</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  name="Calories Consumed" 
                  stroke="#ffc658" 
                />
                <Line 
                  type="monotone" 
                  dataKey="caloriesBurned" 
                  name="Calories Burned" 
                  stroke="#ff7300" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Macronutrients Chart */}
          <div className="h-[300px]">
            <h3 className="text-lg font-semibold mb-2">Macronutrients</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="protein" 
                  name="Protein (g)" 
                  stroke="#8884d8" 
                />
                <Line 
                  type="monotone" 
                  dataKey="carbs" 
                  name="Carbs (g)" 
                  stroke="#82ca9d" 
                />
                <Line 
                  type="monotone" 
                  dataKey="fats" 
                  name="Fats (g)" 
                  stroke="#ffc658" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
