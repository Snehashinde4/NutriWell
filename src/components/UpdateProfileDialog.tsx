'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  age: z.number().min(1, {
    message: "Age must be at least 1.",
  }).max(120, {
    message: "Age must be less than 120.",
  }).nullable(),
  height: z.number().positive({
    message: "Height must be a positive number.",
  }).nullable(),
  weight: z.number().positive({
    message: "Weight must be a positive number.",
  }).nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  activityLevel: z.enum([
    'SEDENTARY',
    'LIGHT',
    'MODERATE',
    'VERY_ACTIVE',
    'EXTREMELY_ACTIVE'
  ]),
  weeklyExercise: z.number().min(0, {
    message: "Weekly exercise cannot be negative.",
  }).max(30, {
    message: "Weekly exercise cannot exceed 30 hours.",
  }).nullable(),
  targetWeight: z.number().positive({
    message: "Target weight must be a positive number.",
  }).nullable(),
  healthGoals: z.array(z.string()).optional(),
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
}

export function UpdateProfileDialog({ isOpen, onClose }: UpdateProfileDialogProps) {
  const { data: session } = useSession()
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: null,
      height: null,
      weight: null,
      gender: undefined,
      activityLevel: 'SEDENTARY',
      weeklyExercise: null,
      targetWeight: null,
      healthGoals: [],
    },
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchHealthProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/user/health-profile?userId=${session.user.id}`)
          if (response.ok) {
            const data = await response.json()
            form.reset(data)
          } else {
            throw new Error('Failed to fetch health profile')
          }
        } catch (error) {
          console.error('Error fetching health profile:', error)
          toast({
            title: "Error",
            description: "Failed to load health profile. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (isOpen) {
      fetchHealthProfile()
    }
  }, [isOpen, session, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }

    try {
      const response = await fetch('/api/user/health-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedProfile = await response.json()
      console.log('Updated profile:', updatedProfile)

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      onClose()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const steps = [
    {
      title: "Personal Information",
      fields: ["age", "gender"]
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

  if (isLoading) {
    return null // Or a loading spinner
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderNumberField = (field: any, onChange: (value: number | null) => void) => (
    <Input
      {...field}
      type="number"
      value={field.value ?? ''} // Use empty string when null
      onChange={(e) => {
        const value = e.target.value === '' ? null : Number(e.target.value)
        onChange(value)
      }}
    />
  )


  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setStep(0);
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600">{steps[step].title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {currentStepFields.includes("age") && (
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      {renderNumberField(field, field.onChange)}
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
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
                      {renderNumberField(field, field.onChange)}
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
                      {renderNumberField(field, field.onChange)}
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
                      {renderNumberField(field, field.onChange)}
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
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
                      {renderNumberField(field, field.onChange)}
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
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {step < steps.length - 1 ? "Next" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


