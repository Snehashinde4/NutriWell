'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Loader2, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import MaxWidthWrapper from '@/components/wrapper/MaxwidthWrapper'

interface WorkoutRecommendations {
  recommendation1: string
  recommendation2: string
}

export default function WorkoutRecommendationsPage() {
  const { data: session } = useSession()
  const [recommendations, setRecommendations] = useState<WorkoutRecommendations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchRecommendations = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Not authenticated",
        description: "Please sign in to use this feature.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setRecommendations(null)

    try {
      const response = await fetch('/api/workout-recommendations')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch recommendations')
      }
      const data = await response.json()
      if (!data.recommendation1 || !data.recommendation2) {
        throw new Error('Invalid recommendation format received')
      }
      setRecommendations(data)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch recommendations'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      fetchRecommendations()
    }
  }, [session?.user?.id])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <MaxWidthWrapper className="py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-3xl font-bold text-green-600 mb-6 flex items-center gap-2"
          variants={itemVariants}
        >
          <Dumbbell className="w-8 h-8" />
          Your Personalized Workout Plan
        </motion.h1>

        {isLoading ? (
          <motion.div 
            className="flex justify-center items-center h-64"
            variants={itemVariants}
          >
            <Loader2 className="h-16 w-16 animate-spin text-green-600" />
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-center text-red-500 my-8"
            variants={itemVariants}
          >
            {error}
          </motion.div>
        ) : recommendations ? (
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-600">Strength Training Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: recommendations.recommendation1
                        .replace(/\n/g, '<br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-600">Cardio & Flexibility Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ 
                      __html: recommendations.recommendation2
                        .replace(/\n/g, '<br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : null}

        <motion.div 
          className="mt-6 flex justify-center"
          variants={itemVariants}
        >
          <Button
            onClick={fetchRecommendations}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Your Plan...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New Plan
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </MaxWidthWrapper>
  )
}
