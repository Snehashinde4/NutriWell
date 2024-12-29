'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dumbbell, Clock, Flame, FileText } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ExerciseLogDialogProps {
  onExerciseLogged: () => void
}

export function ExerciseLogDialog({ onExerciseLogged }: ExerciseLogDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState('')
  const [duration, setDuration] = useState('')
  const [intensity, setIntensity] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [notes, setNotes] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/exercise-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          duration: parseInt(duration),
          intensity,
          caloriesBurned: parseInt(caloriesBurned),
          notes,
        }),
      })

      if (response.ok) {
        toast({
          title: "Exercise logged successfully",
          description: "Your exercise has been recorded.",
        })
        // Reset form and close dialog
        setType('')
        setDuration('')
        setIntensity('')
        setCaloriesBurned('')
        setNotes('')
        setIsOpen(false)
        // Refresh the dashboard data
        onExerciseLogged()
      } else {
        throw new Error('Failed to log exercise')
      }
    } catch (error) {
      console.error('Error logging exercise:', error)
      toast({
        title: "Error",
        description: "Failed to log exercise. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          <Dumbbell className="w-5 h-5 mr-2" />
          Log Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-600 flex items-center">
            <Dumbbell className="w-6 h-6 mr-2" />
            Log Exercise
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select exercise type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CARDIO">Cardio</SelectItem>
                <SelectItem value="STRENGTH">Strength</SelectItem>
                <SelectItem value="FLEXIBILITY">Flexibility</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-500" />
            <Input
              type="number"
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div>
            <Select value={intensity} onValueChange={setIntensity} required>
              <SelectTrigger>
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MODERATE">Moderate</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <Input
              type="number"
              placeholder="Calories burned"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
            />
          </div>
          <div className="flex items-start space-x-2">
            <FileText className="w-5 h-5 text-blue-500 mt-2" />
            <Textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Log Exercise
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


