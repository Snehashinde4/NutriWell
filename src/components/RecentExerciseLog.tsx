import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Clock, Flame, Calendar } from 'lucide-react'

interface ExerciseLog {
  id: string
  type: string
  duration: number
  intensity: string
  caloriesBurned: number
  date: string
}

interface RecentExerciseLogProps {
  log: ExerciseLog | null
}

export function RecentExerciseLog({ log }: RecentExerciseLogProps) {
  if (!log) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-600 flex items-center">
            <Dumbbell className="w-6 h-6 mr-2" />
            Recent Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No recent exercise logged today.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-600 flex items-center">
          <Dumbbell className="w-6 h-6 mr-2" />
          Recent Exercise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            <span>{new Date(log.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Dumbbell className="w-5 h-5 mr-2 text-green-500" />
            <span>{log.type}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-500" />
            <span>{log.duration} minutes</span>
          </div>
          <div className="flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-500" />
            <span>{log.caloriesBurned} calories burned</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">Intensity:</span>
            <span>{log.intensity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


