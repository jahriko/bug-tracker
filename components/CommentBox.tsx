"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createComment } from "@/server/actions/comment"

const FormSchema = z.object({
  comment: z.string(),
})

export default function IssueComment({ issueId }: { issueId: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await createComment(Number(issueId), data)

    if (result.code === "error") {
      return toast("Something went wrong. Please try again.")
    }

    form.reset()
    return toast("Comment added") 
  }

  return (
    <Form {...form}>
      <form className="space-y-3 ml-1" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="resize-none px-4"
                  placeholder="Write your message here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="sm" type="submit">
          Comment
        </Button>
      </form>
    </Form>
  )
}
