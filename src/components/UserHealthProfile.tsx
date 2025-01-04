'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

interface HealthProfile {
  age: number
  height: number
  weight: number
  gender?: string
  activityLevel: string
  weeklyExercise: number
  bmi?: number
  targetWeight?: number
  healthGoals: string[]
}

export function UserHealthProfile() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<HealthProfile | null>(null)
  const { toast } = useToast()


  useEffect(() => {
    const fetchHealthProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/user/health-profile?userId=${session.user.id}`)
          if (response.ok) {
            const data = await response.json()
            setProfile(data)
          } else {
            throw new Error('Failed to fetch health profile')
          }
        } catch (error) {
          console.error('Error fetching health profile:', error)
          toast({
            title: "Error",
            description: "Failed to load health profile. Please try again.",
            variant: "destructive",
          })
        }
      }
    }

    fetchHealthProfile()
  }, [session])

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

  if (!profile) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-600">Your Health Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading health profile...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-600">Your Health Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-4"
        >
          <motion.div variants={itemVariants} className="flex flex-col">
            <span className="text-sm text-gray-500">Age</span>
            <span className="text-lg font-semibold">{profile.age} years</span>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col">
            <span className="text-sm text-gray-500">Gender</span>
            <span className="text-lg font-semibold">{profile.gender || 'Not specified'}</span>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col">
            <span className="text-sm text-gray-500">Height</span>
            <span className="text-lg font-semibold">{profile.height} cm</span>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col">
            <span className="text-sm text-gray-500">Weight</span>
            <span className="text-lg font-semibold">{profile.weight} kg</span>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col">
            <span className="text-sm text-gray-500">BMI</span>
            <span className="text-lg font-semibold">{profile.bmi?.toFixed(1) || 'Not calculated'}</span>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col">
            <span className="text-sm text-gray-500">Target Weight</span>
            <span className="text-lg font-semibold">{profile.targetWeight ? `${profile.targetWeight} kg` : 'Not set'}</span>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col">
            <span className="text-sm text-gray-500">Activity Level</span>
            <span className="text-lg font-semibold">{profile.activityLevel}</span>
          </motion.div>
          <motion.div variants={itemVariants} className="flex flex-col">
            <span className="text-sm text-gray-500">Weekly Exercise</span>
            <span className="text-lg font-semibold">{profile.weeklyExercise} times</span>
          </motion.div>
          <motion.div variants={itemVariants} className="col-span-2">
            <span className="text-sm text-gray-500">Health Goals</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.healthGoals.map((goal, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                  {goal}
                </Badge>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}


