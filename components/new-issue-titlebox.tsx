import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormMessage } from "./ui/form"
import { Input } from "./ui/input"

export default function TitleBox() {
  const { control, setError } = useFormContext()
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              className="border-none text-lg font-medium"
              placeholder="Issue title"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}