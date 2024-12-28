import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const healthProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  age: z.number().int(),
  height: z.number(),
  weight: z.number(),
  gender: z.string().nullish(),
  activityLevel: z.string(),
  weeklyExercise: z.number().int(),
  bmi: z.number().nullish(),
  targetWeight: z.number().nullish(),
  healthGoals: z.string().array(),
  createdAt: z.date(),
})

export interface CompleteHealthProfile extends z.infer<typeof healthProfileSchema> {
  user: CompleteUser
}

/**
 * relatedHealthProfileSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedHealthProfileSchema: z.ZodSchema<CompleteHealthProfile> = z.lazy(() => healthProfileSchema.extend({
  user: relatedUserSchema,
}))
