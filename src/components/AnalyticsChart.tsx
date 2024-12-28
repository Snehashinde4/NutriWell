'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { date: '2023-01', weight: 75, bmi: 23.1, calories: 2200 },
  { date: '2023-02', weight: 74, bmi: 22.8, calories: 2180 },
  { date: '2023-03', weight: 73.5, bmi: 22.7, calories: 2150 },
  { date: '2023-04', weight: 72.8, bmi: 22.5, calories: 2130 },
  { date: '2023-05', weight: 72, bmi: 22.2, calories: 2100 },
  { date: '2023-06', weight: 71.5, bmi: 22.1, calories: 2080 },
]

export function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="left" type="monotone" dataKey="bmi" stroke="#82ca9d" />
        <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  )
}


