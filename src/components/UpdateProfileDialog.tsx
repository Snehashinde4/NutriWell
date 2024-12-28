'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from '@/hooks/use-toast'
import { GetProfile, UpdateProfile } from '@/app/api/actions/profile'
import { HealthProfile } from '@prisma/client'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  age: z.coerce.number().min(1, {
    message: "Age must be at least 1.",
  }).max(120, {
    message: "Age must be less than 120.",
  }),
  height: z.coerce.number().positive({
    message: "Height must be a positive number.",
  }),
  weight: z.coerce.number().positive({
    message: "Weight must be a positive number.",
  }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  activityLevel: z.enum([
    'SEDENTARY',
    'LIGHT',
    'MODERATE',
    'VERY_ACTIVE',
    'EXTREMELY_ACTIVE'
  ]),
  weeklyExercise: z.coerce.number().min(0, {
    message: "Weekly exercise cannot be negative.",
  }).max(30, {
    message: "Weekly exercise cannot exceed 30 hours.",
  }),
  targetWeight: z.coerce.number().positive({
    message: "Target weight must be a positive number.",
  }).optional(),
  healthGoals: z.array(z.string()).default([]),
})

const healthGoalOptions = [
  { id: 'lose-weight', label: 'Lose Weight' },
  { id: 'gain-muscle', label: 'Gain Muscle' },
  { id: 'improve-fitness', label: 'Improve Fitness' },
  { id: 'eat-healthier', label: 'Eat Healthier' },
  { id: 'reduce-stress', label: 'Reduce Stress' },
]

interface UpdateProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  initialData: z.infer<typeof formSchema>
}

export function UpdateProfileDialog({ isOpen, onClose, initialData }: UpdateProfileDialogProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      healthGoals: initialData.healthGoals || [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const userData = await GetProfile()

      const profileData = {
        age: values.age,
        height: values.height,
        weight: values.weight,
        gender: values.gender || null, // Convert undefined to null
        activityLevel: values.activityLevel,
        weeklyExercise: values.weeklyExercise,
        targetWeight: values.targetWeight || null, // Convert undefined to null
        healthGoals: values.healthGoals,
      }

      const response = await UpdateProfile(profileData)

      if (!response.success) {
        throw new Error(response.error || 'Failed to update profile')
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    {
      title: "Personal Information",
      fields: ["name", "email", "age", "gender"]
    },
    {
      title: "Physical Information",
      fields: ["height", "weight", "targetWeight"]
    },
    {
      title: "Activity & Goals",
      fields: ["activityLevel", "weeklyExercise", "healthGoals"]
    }
  ]

  const currentStepFields = steps[step].fields

  const canProceed = () => {
    const currentFields = steps[step].fields
    return currentFields.every(field => {
      const fieldState = form.getFieldState(field as keyof z.infer<typeof formSchema>)
      return !fieldState.invalid
    })
  }

  const handleNext = () => {
    if (canProceed()) {
      setStep(step + 1)
    } else {
      // Trigger validation for current step fields
      steps[step].fields.forEach(field => {
        form.trigger(field as keyof z.infer<typeof formSchema>)
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">{steps[step].title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {currentStepFields.includes("name") && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {currentStepFields.includes("email") && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {currentStepFields.includes("age") && (
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {currentStepFields.includes("gender") && (
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {currentStepFields.includes("height") && (
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {currentStepFields.includes("weight") && (
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {currentStepFields.includes("targetWeight") && (
              <FormField
                control={form.control}
                name="targetWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Weight (kg)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {currentStepFields.includes("activityLevel") && (
              <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your activity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SEDENTARY">Sedentary</SelectItem>
                        <SelectItem value="LIGHT">Light</SelectItem>
                        <SelectItem value="MODERATE">Moderate</SelectItem>
                        <SelectItem value="VERY_ACTIVE">Very Active</SelectItem>
                        <SelectItem value="EXTREMELY_ACTIVE">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {currentStepFields.includes("weeklyExercise") && (
              <FormField
                control={form.control}
                name="weeklyExercise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Exercise (hours)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {currentStepFields.includes("healthGoals") && (
              <FormField
                control={form.control}
                name="healthGoals"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Health Goals</FormLabel>
                      <FormDescription>
                        Select your health goals
                      </FormDescription>
                    </div>
                    {healthGoalOptions.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="healthGoals"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-between space-x-2">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                >
                  Previous
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !form.formState.isValid}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


