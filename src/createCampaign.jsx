import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import nameSchema from "./types/campaignType"

function SimpleForm() {

  const {
    register,
    handleSubmit,
    formState: errors,
  } = useForm({
    resolver: zodResolver(nameSchema)
  })
  const onSubmit = (data: Object) => {
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