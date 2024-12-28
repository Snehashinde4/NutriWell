import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from 'lucide-react'

interface BMIResultProps {
  bmi: number
}

export function BMIResult({ bmi }: BMIResultProps) {
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-blue-500" }
    if (bmi < 25) return { category: "Normal weight", color: "text-green-500" }
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-500" }
    return { category: "Obese", color: "text-red-500" }
  }

  const { category, color } = getBMICategory(bmi)

  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">BMI Result</CardTitle>
        <ChevronRight className="h-6 w-6 text-green-600" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{bmi.toFixed(1)}</div>
            <div className={`text-sm font-medium ${color}`}>{category}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">BMI Range</div>
            <div className="text-sm font-medium">18.5 - 24.9</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


