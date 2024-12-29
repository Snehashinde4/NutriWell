'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
import MaxWidthWrapper from '@/components/wrapper/MaxwidthWrapper'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Loader2, Apple, Beef, CroissantIcon as Bread, ChevronsUpIcon as Cheese } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export default function FoodRecognitionPage() {
  const { data: session } = useSession()
  const [foodInput, setFoodInput] = useState<string | File>('')
  const [inputType, setInputType] = useState<'text' | 'image'>('text')
  const [mealType, setMealType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to use this feature.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('foodInput', foodInput)
    formData.append('inputType', inputType)
    formData.append('mealType', mealType)

    try {
      const response = await fetch('/api/food-recognition', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to recognize food')
      }

      const data = await response.json()
      setResult(data)
      toast({
        title: "Food recognized",
        description: "Nutritional information has been logged.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to recognize food. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoodInput(e.target.files[0])
    }
  }

  const getNutritionScore = (calories: number, protein: number, carbs: number, fats: number) => {
    // This is a simplified scoring system. You may want to implement a more sophisticated one.
    const score = (protein * 4 + carbs * 2 + fats * 9) / calories * 100
    if (score > 80) return { score: 'A', color: 'text-green-500' }
    if (score > 60) return { score: 'B', color: 'text-blue-500' }
    if (score > 40) return { score: 'C', color: 'text-yellow-500' }
    if (score > 20) return { score: 'D', color: 'text-orange-500' }
    return { score: 'F', color: 'text-red-500' }
  }

  return (
    <MaxWidthWrapper className="py-10">
      <div className="flex flex-col md:flex-row gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-600">Food Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Select onValueChange={(value) => setInputType(value as 'text' | 'image')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select input type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {inputType === 'text' ? (
                  <Input
                    type="text"
                    placeholder="Enter food name"
                    onChange={(e) => setFoodInput(e.target.value)}
                    required
                  />
                ) : (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                )}
                <div>
                  <Select onValueChange={setMealType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                      <SelectItem value="LUNCH">Lunch</SelectItem>
                      <SelectItem value="DINNER">Dinner</SelectItem>
                      <SelectItem value="SNACK">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Recognize Food'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-green-600">Nutrition Information</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{result.nutritionInfo.foodName}</h3>
                    {(() => {
                      const { score, color } = getNutritionScore(
                        result.nutritionInfo.calories,
                        result.nutritionInfo.protein,
                        result.nutritionInfo.carbs,
                        result.nutritionInfo.fats
                      )
                      return <span className={`text-2xl font-bold ${color}`}>{score}</span>
                    })()}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Apple className="h-5 w-5 mr-2 text-red-500" />
                      <span>Calories: {result.nutritionInfo.calories}</span>
                    </div>
                    <div className="flex items-center">
                      <Beef className="h-5 w-5 mr-2 text-purple-500" />
                      <span>Protein: {result.nutritionInfo.protein}g</span>
                    </div>
                    <div className="flex items-center">
                      <Bread className="h-5 w-5 mr-2 text-yellow-500" />
                      <span>Carbs: {result.nutritionInfo.carbs}g</span>
                    </div>
                    <div className="flex items-center">
                      <Cheese className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Fats: {result.nutritionInfo.fats}g</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">Macronutrient Breakdown</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Protein', value: result.nutritionInfo.protein },
                            { name: 'Carbs', value: result.nutritionInfo.carbs },
                            { name: 'Fats', value: result.nutritionInfo.fats },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Protein', value: result.nutritionInfo.protein },
                            { name: 'Carbs', value: result.nutritionInfo.carbs },
                            { name: 'Fats', value: result.nutritionInfo.fats },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No food recognized yet. Use the form on the left to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MaxWidthWrapper>
  )
}


