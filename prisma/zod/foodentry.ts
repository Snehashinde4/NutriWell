import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteDietaryLog, relatedDietaryLogSchema } from "./index"

export const foodEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  dietaryLogId: z.string().nullish(),
  foodName: z.string(),
  calories: z.number().int(),
  protein: z.number().nullish(),
  carbs: z.number().nullish(),
  fats: z.number().nullish(),
  imageUrl: z.string().nullish(),
  aiPredicted: z.boolean(),
  servingSize: z.string().nullish(),
  mealType: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteFoodEntry extends z.infer<typeof foodEntrySchema> {
  user: CompleteUser
  dietaryLog?: CompleteDietaryLog | null
}

/**
 * relatedFoodEntrySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedFoodEntrySchema: z.ZodSchema<CompleteFoodEntry> = z.lazy(() => foodEntrySchema.extend({
  user: relatedUserSchema,
  dietaryLog: relatedDietaryLogSchema.nullish(),
}))
