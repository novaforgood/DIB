import { z } from "zod";

export const nameSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetAmount: z.string().min(1, "Target amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a valid positive number"
    }),
  endDate: z.string().min(1, "End date is required"), 
  description: z.string().min(1, "Description is required"),
  activeStatus: z.boolean(),
});

export type formData = z.infer<typeof nameSchema>;