import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const weightGoalLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  startWeight: z.number(),
  targetWeight: z.number(),
  currentWeight: z.number(),
  goalType: z.string(),
  status: z.string(),
  startDate: z.date(),
  targetDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteWeightGoalLog extends z.infer<typeof weightGoalLogSchema> {
  user: CompleteUser
}

/**
 * relatedWeightGoalLogSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedWeightGoalLogSchema: z.ZodSchema<CompleteWeightGoalLog> = z.lazy(() => weightGoalLogSchema.extend({
  user: relatedUserSchema,
}))
