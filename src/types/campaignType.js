import { z } from "zod";

const nameSchema = z.object({
	// whenever we check data against nameSchema, we expect an object 
	// with a name that is not empty
  name: z.string().min(1, "Name is required"),
  targetAmount: z.string().min(1, "Target amount is required"),
  endDate: z.string().iso.date(),
  description: z.string().min(1, "Description is required"),
  activeStatus: z.boolean().refine((value) => value === true),


}); 



export default nameSchema;