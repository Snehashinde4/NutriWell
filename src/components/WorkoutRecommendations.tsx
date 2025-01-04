'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function WorkoutRecommendations() {
  const { data: session } = useSession()
  const [recommendations, setRecommendations] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()

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
    setRecommendations(null)

    try {
      const response = await fetch('/api/workout-recommendations')
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      toast({
        title: "Error",
        description: "Failed to fetch workout recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [session])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
          <Dumbbell className="w-6 h-6" />
          Workout Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : recommendations ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="prose prose-sm max-w-none"
          >
            <div dangerouslySetInnerHTML={{ __html: recommendations.replace(/\n/g, '<br>') }} />
          </motion.div>
        ) : (
          <p className="text-center text-gray-500">
            No recommendations available. Try refreshing.
          </p>
        )}
        <div className="mt-4">
          <Button
            onClick={fetchRecommendations}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Refresh Recommendations'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


