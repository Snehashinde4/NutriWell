'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Apple, Calculator, History, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import MaxWidthWrapper from './wrapper/MaxwidthWrapper'

const features = [
  {
    icon: Apple,
    title: 'Food Recognition',
    description: 'Instantly identify foods and their nutritional content'
  },
  {
    icon: Calculator,
    title: 'BMI Calculator',
    description: 'Calculate and track your Body Mass Index'
  },
  {
    icon: History,
    title: 'Health History',
    description: 'Maintain a comprehensive record of your health journey'
  },
  {
    icon: Brain,
    title: 'AI Suggestions',
    description: 'Get personalized AI recommendations for your wellness goals'
  }
]

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-green-100 via-green-50/50 to-white transition-colors duration-1000 ease-in-out" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-green-100/40 via-white/20 to-transparent" />
      <div className="absolute -top-40 right-0 w-96 h-96 bg-green-100/50 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-green-50/50 rounded-full blur-3xl opacity-30 animate-pulse" />

      <MaxWidthWrapper className="relative pt-24 pb-32 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:pt-32 xl:pt-36 lg:pb-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 lg:px-0 lg:pt-4"
        >
          <div className="relative mx-auto lg:mx-0 flex flex-col items-center lg:items-start">
            <motion.div variants={itemVariants} className="mb-8">
              <Badge variant="outline" className="px-4 py-2 border-green-200 bg-white/50 backdrop-blur-sm">
                <span className="text-green-600 font-semibold">Your Personal Wellness Journey</span>
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="relative text-balance font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl text-center lg:text-left"
            >
              Transform Your{' '}
              <span className="relative">
                <span className="relative z-10 bg-green-600 px-4 text-white rounded-md">
                  Health
                </span>
                <div className="absolute inset-0 bg-green-200/30 blur-2xl" />
              </span>{' '}
              With AI-Powered Insights
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-8 text-green-600 font-semibold text-lg text-center lg:text-left"
            >
              &quot;Your all-in-one nutrition and wellness companion for a healthier, happier you.&quot;
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance text-gray-600"
            >
              Track your nutrition, calculate your BMI, and receive personalized AI recommendations to achieve your wellness goals.
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="mt-12 grid gap-4 w-full max-w-lg"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-green-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-2 rounded-lg bg-green-50">
                    <feature.icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mt-16 lg:mt-0 px-6 lg:px-0"
        >
          <div className="grid grid-cols-12 grid-rows-16 gap-4 h-[1000px]">
            {/* Add your app screenshots or relevant images here */}
            {/* Example: */}
            <div className="col-span-12 row-span-4 relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="App Dashboard"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Add more grid items for additional screenshots */}
          </div>

          <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-green-200 to-green-100 rounded-full blur-2xl opacity-80" />
        </motion.div>
      </MaxWidthWrapper>
    </section>
  )
}

export default Hero


