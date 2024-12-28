'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, Calculator, ChevronRight } from 'lucide-react'
import { CurrentBMI } from '@/components/CurrentBMI'
import { BMICalculator } from '@/components/BMICalculator'
import { BMIResult } from '@/components/BMIResult'
import { useToast } from '@/hooks/use-toast'
import MaxWidthWrapper from '@/components/wrapper/MaxwidthWrapper'

export default function BMIPage() {
  const { data: session } = useSession()
  const [currentBMI, setCurrentBMI] = useState<number | null>(null)
  const [calculatedBMI, setCalculatedBMI] = useState<number | null>(null)
  const {toast} = useToast()

  const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  const fetchCurrentBMI = async () => {
    if (session?.user?.id) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/user/bmi?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          setCurrentBMI(data.bmi)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch current BMI",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error fetching BMI:', error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }
  fetchCurrentBMI()
}, [session])

  return (
    <MaxWidthWrapper className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">BMI Calculator</CardTitle>
            <Scale className="h-8 w-8 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Calculate your Body Mass Index (BMI) and track your health progress.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <CurrentBMI bmi={currentBMI} />
          <BMICalculator onCalculate={setCalculatedBMI} />
          {calculatedBMI !== null && <BMIResult bmi={calculatedBMI} />}
        </div>
      </motion.div>
    </MaxWidthWrapper>
  )
}


