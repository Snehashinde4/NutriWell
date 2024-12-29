'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Apple, Calculator, History, Brain, User, Dumbbell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UpdateProfileDialog } from "@/components/UpdateProfileDialog"
import { AnalyticsChart } from "@/components/AnalyticsChart"
import { UserHealthProfile } from "@/components/UserHealthProfile"
import { ExerciseLogDialog } from "@/components/ExerciseLogDialog"
import { RecentExerciseLog } from "@/components/RecentExerciseLog"
import MaxWidthWrapper from '@/components/wrapper/MaxwidthWrapper'

const features = [
  {
    icon: Apple,
    title: 'Food Recognition',
    description: 'Analyze your meals with AI',
    href: '/food-recognition'
  },
  {
    icon: Calculator,
    title: 'BMI Calculator',
    description: 'Calculate and track your BMI',
    href: '/bmi-calculator'
  },
  {
    icon: History,
    title: 'Health History',
    description: 'View your health journey',
    href: '/health-history'
  },
  {
    icon: Brain,
    title: 'AI Suggestions',
    description: 'Get personalized health tips',
    href: '/ai-suggestions'
  },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [recentExercise, setRecentExercise] = useState(null)

  // Mock data for the health profile
  const mockHealthProfile = {
    age: 30,
    height: 175,
    weight: 70,
    gender: 'Male',
    activityLevel: 'MODERATE',
    weeklyExercise: 3,
    bmi: 22.9,
    targetWeight: 68,
    healthGoals: ['Lose Weight', 'Improve Fitness', 'Eat Healthier']
  }

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

  const fetchRecentExercise = async () => {
    try {
      const response = await fetch('/api/exercise-log/recent')
      if (response.ok) {
        const data = await response.json()
        setRecentExercise(data)
      }
    } catch (error) {
      console.error('Error fetching recent exercise:', error)
    }
  }

  useEffect(() => {
    fetchRecentExercise()

    // Check if it's a new day and reset the exercise log if necessary
    const now = new Date()
    const lastChecked = localStorage.getItem('lastCheckedDate')
    if (lastChecked && new Date(lastChecked).getDate() !== now.getDate()) {
      setRecentExercise(null)
    }
    localStorage.setItem('lastCheckedDate', now.toISOString())

    // Set up an interval to check for a new day every minute
    const interval = setInterval(() => {
      const currentDate = new Date()
      if (lastChecked && new Date(lastChecked).getDate() !== currentDate.getDate()) {
        setRecentExercise(null)
        localStorage.setItem('lastCheckedDate', currentDate.toISOString())
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const getGreeting = (email: string | null | undefined) => {
    const emailGreetings: Record<string, string> = {
      'snehashindee.04@gmail.com': 'Ayee Chiknii 🫦',
      'snehaashinde04@gmail.com': 'Ayee Chiknii 🫦',
      'shreya.svg19@gmail.com': 'Ayeee Chaprii 🌈',
    };

    return email ? emailGreetings[email] || null : null;
  };

  return (
    <MaxWidthWrapper className="py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-3xl font-bold text-green-600 mb-6"
          variants={itemVariants}
        >
          Welcome back,{' '}
          {getGreeting(session?.user?.email) ? (
            <span className="text-green-600">{getGreeting(session?.user?.email)}</span>
          ) : (
            session?.user?.name || 'User'
          )}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <UserHealthProfile profile={mockHealthProfile} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RecentExerciseLog log={recentExercise} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Dumbbell className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Exercise Log</CardTitle>
                <CardDescription>Record your workouts</CardDescription>
              </CardHeader>
              <CardFooter>
                <ExerciseLogDialog onExerciseLogged={fetchRecentExercise} />
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <User className="h-8 w-8 text-green-500 mb-2" />
                <CardTitle>Update Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => setIsProfileDialogOpen(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-green-500 mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link href={feature.href} passHref>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Go to {feature.title}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Health Analytics</CardTitle>
              <CardDescription>Track your progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <UpdateProfileDialog
        isOpen={isProfileDialogOpen}
        onClose={() => setIsProfileDialogOpen(false)}
        initialData={{
          name: session?.user?.name || '',
          email: session?.user?.email || '',
          age: mockHealthProfile.age,
          height: mockHealthProfile.height,
          weight: mockHealthProfile.weight,
          gender: 'MALE',
          activityLevel: 'MODERATE',
          weeklyExercise: mockHealthProfile.weeklyExercise,
          targetWeight: mockHealthProfile.targetWeight,
          healthGoals: mockHealthProfile.healthGoals,
        }}
      />
    </MaxWidthWrapper>
  )
}


