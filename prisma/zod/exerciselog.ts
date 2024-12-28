import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const exerciseLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  type: z.string(),
  duration: z.number().int(),
  intensity: z.string(),
  caloriesBurned: z.number().int().nullish(),
  notes: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteExerciseLog extends z.infer<typeof exerciseLogSchema> {
  user: CompleteUser
}

/**
 * relatedExerciseLogSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedExerciseLogSchema: z.ZodSchema<CompleteExerciseLog> = z.lazy(() => exerciseLogSchema.extend({
  user: relatedUserSchema,
}))
