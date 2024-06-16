import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormItem,
  FormMessage,
  FormField,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

export default function DescriptionField() {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Textarea placeholder="Description" rows={10} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
