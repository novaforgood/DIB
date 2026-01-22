import { create } from 'zustand'
import { persist } from 'zustand/middleware'    
import { formData } from '../../types/campaignType'


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

            // currentForm: (form) => {form: {...form},

            updateForm: (form) =>
                set((state) => ({ form: { ...state.form, ...form } })),
            
            clearForm: () => set({ form: {} }),
        }),
        {
            name: 'new-intake-form-storage',
        },
    ),
 )
