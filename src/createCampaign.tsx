import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { formData, nameSchema } from "./types/campaignType.ts"

//zustand code 
export type State = {
    form: Partial<formData>  
}
export type Actions = {
  updateForm: (form: Partial<formData>) => void
  clearForm: () => void
}

export const useIntakeFormStore = create<State & Actions>()(
    persist(
        (set) => ({
            form: {},

            updateForm: (form) =>
                set((state) => ({ form: { ...state.form, ...form } })),
            
            clearForm: () => set({ form: {} }),
        }),
        {
            name: 'new-intake-form-storage',
        },
    ),
 )
//end zustand


function SimpleForm() {

  const {
    register,
    handleSubmit,
    formState: errors,
  } = useForm({
    resolver: zodResolver(nameSchema)
  })
  const onSubmit = (data: formData) => { 
    console.log(data);
  }
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name")} placeholder="Your name"/>

          {errors.name && <p>{errors.name.message}</p>}

        <button type = "submit"> Submit </button>
        
      </form>
    )
}
export default SimpleForm