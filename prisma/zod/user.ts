import * as z from "zod"
import { CompleteAccount, relatedAccountSchema, CompleteSession, relatedSessionSchema, CompleteHealthProfile, relatedHealthProfileSchema, CompleteDietaryLog, relatedDietaryLogSchema, CompleteExerciseLog, relatedExerciseLogSchema, CompleteFoodEntry, relatedFoodEntrySchema, CompleteWeightGoalLog, relatedWeightGoalLogSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  createdAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  healthProfile?: CompleteHealthProfile | null
  dietaryLogs: CompleteDietaryLog[]
  exerciseLogs: CompleteExerciseLog[]
  foodEntries: CompleteFoodEntry[]
  weightGoalLogs: CompleteWeightGoalLog[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  accounts: relatedAccountSchema.array(),
  sessions: relatedSessionSchema.array(),
  healthProfile: relatedHealthProfileSchema.nullish(),
  dietaryLogs: relatedDietaryLogSchema.array(),
  exerciseLogs: relatedExerciseLogSchema.array(),
  foodEntries: relatedFoodEntrySchema.array(),
  weightGoalLogs: relatedWeightGoalLogSchema.array(),
}))
