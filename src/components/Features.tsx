import React from 'react'
import { Card } from '@/components/ui/card'
import { Apple, Calculator, History, Brain, Camera } from 'lucide-react'

const Features = () => {
  const features = [
    {
      id: 1,
      icon: <Camera className="w-12 h-12 text-green-500" />,
      title: "Food Recognition",
      description: "Upload food images to instantly get nutritional information and calorie counts.",
      bulletPoints: [
        "AI-powered image recognition",
        "Extensive food database",
        "Instant nutritional breakdown",
        "Calorie tracking"
      ]
    },
    {
      id: 2,
      icon: <Calculator className="w-12 h-12 text-green-500" />,
      title: "BMI Calculator",
      description: "Calculate your Body Mass Index and get personalized health insights.",
      bulletPoints: [
        "Quick BMI calculation",
        "Personalized health recommendations",
        "Track BMI changes over time",
        "Set BMI goals"
      ]
    },
    {
      id: 3,
      icon: <History className="w-12 h-12 text-green-500" />,
      title: "Health History Tracking",
      description: "Maintain a comprehensive record of your health journey and progress.",
      bulletPoints: [
        "Detailed health logs",
        "Progress visualization",
        "Custom health metrics",
        "Export health data"
      ]
    },
    {
      id: 4,
      icon: <Brain className="w-12 h-12 text-green-500" />,
      title: "AI-Powered Suggestions",
      description: "Receive personalized recommendations to help you achieve your wellness goals.",
      bulletPoints: [
        "Customized meal plans",
        "Workout recommendations",
        "Lifestyle improvement tips",
        "Adaptive goal setting"
      ]
    },
    {
      id: 5,
      icon: <Apple className="w-12 h-12 text-green-500" />,
      title: "Nutrition Tracking",
      description: "Log your meals and track your nutritional intake with ease.",
      bulletPoints: [
        "Macro and micronutrient tracking",
        "Meal planning assistance",
        "Dietary goal setting",
        "Nutritional insights"
      ]
    },
  ]

  return (
    <div className="bg-gradient-to-b from-white to-green-50 py-16">
      <div className="max-w-[90%] mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
          Our Features
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover how our app makes nutrition tracking and wellness simple, personalized, and effective
        </p>
        
        <div className="relative">
          <div className="flex overflow-x-auto pb-8 space-x-6 snap-x snap-mandatory scroll-smooth">
            {features.map((feature) => (
              <Card 
                key={feature.id} 
                className="flex-none w-80 snap-center transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-white backdrop-blur-lg bg-opacity-90 p-6"
              >
                <div className="relative group">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 mb-6 transform transition-transform group-hover:scale-110 duration-300">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-4 group-hover:bg-gradient-to-r from-green-600 to-green-400 group-hover:bg-clip-text group-hover:text-transparent transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 mb-6 text-sm">
                    {feature.description}
                  </p>

                  <ul className="space-y-3">
                    {feature.bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-green-400 rounded-full mr-2"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {features.map((_, index) => (
              <div 
                key={index}
                className="w-2 h-2 rounded-full bg-green-200 transition-colors duration-300 hover:bg-green-500"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features


