'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'
import MaxWidthWrapper from '@/components/wrapper/MaxwidthWrapper'
import { Calendar1, Utensils, Dumbbell, Clock, Flame } from 'lucide-react'
import { DayProps } from 'react-day-picker'

interface DailyLog {
  date: string
  dietaryLogs: {
    id: string
    mealType: string
    totalCalories: number
  }[]
  exerciseLogs: {
    id: string
    type: string
    duration: number
    caloriesBurned: number
  }[]
}

interface DetailedLog {
  date: string
  dietaryLogs: {
    id: string
    mealType: string
    totalCalories: number
    foodItems: {
      id: string
      foodName: string
      calories: number
      protein: number
      carbs: number
      fats: number
    }[]
  }[]
  exerciseLogs: {
    id: string
    type: string
    duration: number
    intensity: string
    caloriesBurned: number
    notes: string
  }[]
}

export default function HistoryPage() {
  const { data: session } = useSession()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([])
  const [detailedLog, setDetailedLog] = useState<DetailedLog | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.id) {
      fetchDailyLogs()
    }
  }, [session])

  const fetchDailyLogs = async () => {
    try {
      const response = await fetch('/api/history')
      if (response.ok) {
        const data = await response.json()
        setDailyLogs(data)
      } else {
        throw new Error('Failed to fetch daily logs')
      }
    } catch (error) {
      console.error('Error fetching daily logs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch history. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchDetailedLog = async (date: string) => {
    try {
      const response = await fetch(`/api/history?date=${date}`)
      if (response.ok) {
        const data = await response.json()
        setDetailedLog(data)
        setIsDialogOpen(true)
      } else {
        throw new Error('Failed to fetch detailed log')
      }
    } catch (error) {
      console.error('Error fetching detailed log:', error)
      toast({
        title: "Error",
        description: "Failed to fetch detailed log. Please try again.",
        variant: "destructive",
      })
    }
  }

  const CustomDay = (props: DayProps) => {
    const formattedDate = format(props.date, 'yyyy-MM-dd')
    const log = dailyLogs.find(log => log.date === formattedDate)
    
    return (
      <div className="flex flex-col items-center w-full">
        <div className="text-xs font-semibold">{props.date.getDate()}</div>
        {log && (
          <div className="text-xs text-green-600">
            {log.dietaryLogs.length + log.exerciseLogs.length}
          </div>
        )}
      </div>
    )
  }

  return (
    <MaxWidthWrapper className="py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-600">History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  if (date) {
                    fetchDetailedLog(format(date, 'yyyy-MM-dd'))
                  }
                }}
                className="rounded-md border"
                components={{
                  Day: CustomDay
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">Selected Date: {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'None'}</h3>
              {selectedDate && (
                <Button onClick={() => fetchDetailedLog(format(selectedDate, 'yyyy-MM-dd'))}>
                  View Detailed Log
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Calendar1 className="w-6 h-6" />
              Detailed Log for {detailedLog?.date ? format(new Date(detailedLog.date), 'MMMM d, yyyy') : ''}
            </DialogTitle>
          </DialogHeader>
          {detailedLog ? (
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Dietary Logs
                </h3>
                {detailedLog.dietaryLogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailedLog.dietaryLogs.map((log) => (
                      <Card key={log.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">{log.mealType}</CardTitle>
                          <CardDescription>{log.totalCalories} calories</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 space-y-1">
                            {log.foodItems.map((item) => (
                              <li key={item.id} className="text-sm">
                                {item.foodName} - {item.calories} cal
                                <span className="text-gray-500">
                                  (P: {item.protein}g, C: {item.carbs}g, F: {item.fats}g)
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No dietary logs for this date.</p>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Exercise Logs
                </h3>
                {detailedLog.exerciseLogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailedLog.exerciseLogs.map((log) => (
                      <Card key={log.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">{log.type}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {log.duration} minutes
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="flex items-center gap-1 mb-1">
                            <span className="font-semibold">Intensity:</span> {log.intensity}
                          </p>
                          <p className="flex items-center gap-1 mb-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="font-semibold">Calories Burned:</span> {log.caloriesBurned}
                          </p>
                          {log.notes && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-semibold">Notes:</span> {log.notes}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No exercise logs for this date.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No logs available for this date.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MaxWidthWrapper>
  )
}
