import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteFoodEntry, relatedFoodEntrySchema } from "./index"

export const dietaryLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  mealType: z.string(),
  totalCalories: z.number().int(),
  notes: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteDietaryLog extends z.infer<typeof dietaryLogSchema> {
  user: CompleteUser
  foodItems: CompleteFoodEntry[]
}

/**
 * relatedDietaryLogSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedDietaryLogSchema: z.ZodSchema<CompleteDietaryLog> = z.lazy(() => dietaryLogSchema.extend({
  user: relatedUserSchema,
  foodItems: relatedFoodEntrySchema.array(),
}))
