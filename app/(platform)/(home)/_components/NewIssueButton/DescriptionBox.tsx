import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../../../../../components/ui/form"
import { Textarea } from "../../../../../components/ui/textarea"

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
