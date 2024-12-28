import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale } from 'lucide-react'

interface CurrentBMIProps {
  bmi: number | null
}

export function CurrentBMI({ bmi }: CurrentBMIProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Your Current BMI</CardTitle>
        <Scale className="h-6 w-6 text-green-600" />
      </CardHeader>
      <CardContent>
        {bmi !== null ? (
          <div className="text-3xl font-bold">{bmi.toFixed(1)}</div>
        ) : (
          <div className="text-sm text-muted-foreground">No BMI data available</div>
        )}
      </CardContent>
    </Card>
  )
}


