'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Loader2, Scale } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
import MaxWidthWrapper from '@/components/wrapper/MaxwidthWrapper'

export default function AISuggestionsPage() {
  const { data: session } = useSession()
  const [suggestions, setSuggestions] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [weightGoal, setWeightGoal] = useState<'decrease' | 'increase' | null>(null)
  const { toast } = useToast()


  const generateSuggestions = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to use this feature.",
        variant: "destructive",
      })
      return
    }

    if (!weightGoal) {
      toast({
        title: "Weight goal required",
        description: "Please select whether you want to increase or decrease weight.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setSuggestions(null)

    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          weightGoal
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await response.json()
      setSuggestions(data.suggestions)
    } catch (error) {
      console.error('Error generating suggestions:', error)
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MaxWidthWrapper className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row gap-6"
      >
        {/* Left side - Form */}
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Get personalized AI suggestions based on your health profile and historical data to help you achieve your fitness goals.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select your weight goal
              </label>
              <Select onValueChange={(value: 'increase' | 'decrease') => setWeightGoal(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your weight goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decrease">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4" />
                      Decrease Weight
                    </div>
                  </SelectItem>
                  <SelectItem value="increase">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4" />
                      Increase Weight
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateSuggestions}
              disabled={isLoading || !weightGoal}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate AI Suggestions'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Right side - Generated Output */}
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-600">
              {weightGoal ? `Your Personalized ${weightGoal === 'decrease' ? 'Weight Loss' : 'Weight Gain'} Plan` : 'Your Personalized Suggestions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {suggestions ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-green-50 p-6 rounded-lg border border-green-200"
              >
                <div className="text-gray-700 whitespace-pre-wrap">
                  {suggestions}
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  <>
                    <Scale className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                    {weightGoal
                      ? "Generate suggestions to see your personalized recommendations."
                      : "Select a weight goal to get started."}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </MaxWidthWrapper>
  )
}
