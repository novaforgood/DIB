import { z } from "zod";

export const nameSchema = z.object({
	// whenever we check data against nameSchema, we expect an object 
	// with a name that is not empty
  name: z.string().min(1, "Name is required"),
  targetAmount: z.string().min(1, "Target amount is required"),
  endDate: z.string(),  //endDate: z.string().transform((str) => new Date(str))   // if we want to change to a string later
  description: z.string().min(1, "Description is required"),
  activeStatus: z.boolean().refine((value) => value === true),
}); 

export type formData = z.infer<typeof nameSchema>;

//i cant get this to work gokul and jimin/travis couldn't figure in the 2 min i asked them