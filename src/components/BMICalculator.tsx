import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calculator } from 'lucide-react'

interface BMICalculatorProps {
  onCalculate: (bmi: number) => void
}

export function BMICalculator({ onCalculate }: BMICalculatorProps) {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100
    const weightInKg = parseFloat(weight)
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmi = weightInKg / (heightInMeters * heightInMeters)
      onCalculate(bmi)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Calculate BMI</CardTitle>
        <Calculator className="h-6 w-6 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="height" className="text-sm font-medium">Height (cm)</label>
            <Input
              id="height"
              type="number"
              placeholder="Enter your height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="weight" className="text-sm font-medium">Weight (kg)</label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter your weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <Button onClick={calculateBMI} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Calculate BMI
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


