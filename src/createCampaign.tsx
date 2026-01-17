import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import formData, nameSchema from "./types/campaignType.ts"

//zustang code idk if right place to put it
export type State = {
    form: Partial<typeof nameSchema>  
}
//end zustang

function SimpleForm() {

  const {
    register,
    handleSubmit,
    formState: errors,
  } = useForm({
    resolver: zodResolver(nameSchema)
  })
  const onSubmit = (data: nameSchema) => {  //would the type not be nameSchema?
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