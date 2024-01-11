import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormControl, FormMessage } from "./ui/form"
import { Textarea } from "./ui/textarea"

export default function DescriptionBox() {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea
              className="border-none"
              placeholder="Add description"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}