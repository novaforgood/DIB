import { useForm } from "react-hook-form";
import {useEffect} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { formData, nameSchema } from "../../types/campaignType.ts"
import { State, Actions, useIntakeFormStore} from "./formState.ts"


function SimpleForm() {
  const { form: loadedForm, clearForm, updateForm } = useIntakeFormStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<formData>({
    mode: "onChange", 
    resolver: zodResolver(nameSchema),
    defaultValues: loadedForm,
  })

  const onSubmit = (data: formData) => { 
    console.log(data);
  }

  // useEffect(() => {
  //   updateForm(loadedForm);   // reset() ?
  //  }, []);

  useEffect(() => {
    const subscription = watch((data) => {
      updateForm({
        ...data,
      });
    });

    return () => subscription.unsubscribe();
  }, [watch, updateForm]);
  
  

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name")} placeholder="Your Name"/>

          {errors.name && <p>{errors.name.message}</p>}

        <button type = "submit"> Submit </button>

        <input {...register("targetAmount")} placeholder="Target Amount"/>

          {errors.targetAmount && <p>{errors.targetAmount.message}</p>}

        <button type = "submit"> Submit </button>

        <input {...register("endDate")} placeholder="End Date"/>

          {errors.endDate && <p>{errors.endDate.message}</p>}

        <button type = "submit"> Submit </button>

        <input {...register("description")} placeholder="Description"/>

          {errors.description && <p>{errors.description.message}</p>}

        <button type = "submit"> Submit </button>
        
      </form>
    )
}
export default SimpleForm