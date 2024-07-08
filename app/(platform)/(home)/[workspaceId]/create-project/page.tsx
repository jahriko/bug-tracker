"use client"
import { Button } from "@/components/catalyst/button"
import {
  Description,
  Field,
  FieldGroup,
  Fieldset,
  Label,
} from "@/components/catalyst/fieldset"
import { Heading } from "@/components/catalyst/heading"
import { Input } from "@/components/catalyst/input"
import { Select } from "@/components/catalyst/select"
import { Text } from "@/components/catalyst/text"
import { Textarea } from "@/components/catalyst/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleDashed } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2, { message: "Project name is required" }),
  projectId: z.string().min(1, { message: "Project ID is required" }),
  description: z.string().optional(),
  workspace: z.string(),
})

const NewProjectPage = () => {
  const [isProjectIdManuallyEdited, setIsProjectIdManuallyEdited] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      projectId: "",
      description: "",
      workspace: "Unassigned",
    },
  })

  const projectId = watch("projectId")

  const generateProjectId = (name: string) => {
    const words = name.split(" ")
    if (words.length === 1) {
      return name.slice(0, 3).toUpperCase()
    } else {
      return words
        .map((word) => word[0])
        .join("")
        .slice(0, 3)
        .toUpperCase()
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/^\s+/, "")
    setValue("name", newValue)

    if (!isProjectIdManuallyEdited) {
      setValue("projectId", generateProjectId(newValue))
    }
  }

  const handleProjectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProjectIdManuallyEdited(true)
    setValue(
      "projectId",
      e.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 3),
    )
  }

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data)
    // Handle form submission here
  }

  return (
    <div className="p-6 text-gray-800">
      <div className="mx-auto max-w-xl">
        <Heading>New Project</Heading>
        <Text className="mb-6">
          Personalize your project to help other users understand its purpose and scope.
          You can update these values from the General Info tab in the project settings if
          needed.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Fieldset aria-label="Project details">
            <FieldGroup>
              <Field>
                <Label>Name</Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        {...field}
                        onChange={handleNameChange}
                        placeholder="Enter a name for your project"
                      />
                      {error ? (
                        <span className="text-sm text-red-500">{error.message}</span>
                      ) : null}
                    </>
                  )}
                  rules={{ required: "Project name is required" }}
                />
              </Field>

              <Field>
                <Label>Project ID</Label>
                <Controller
                  control={control}
                  name="projectId"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        {...field}
                        onChange={handleProjectIdChange}
                        placeholder="Enter project ID"
                      />
                      {error ? (
                        <span className="text-sm text-red-500">{error.message}</span>
                      ) : null}
                    </>
                  )}
                  rules={{ required: "Project ID is required" }}
                />
                <Description>
                  Used as a prefix in IDs for issues and articles that belong to this
                  project
                </Description>
              </Field>
              <div>
                <p className="mb-1 text-xs text-gray-400">Preview</p>
                <div className="mb-6 flex items-center gap-4 rounded bg-gray-50 p-3 shadow ring-1 ring-gray-100">
                  <div>
                    <div className="flex items-center gap-x-3 gap-y-4">
                      <CircleDashed className="size-[1.10rem] text-zinc-500 hover:text-black" />
                      <div className="text-sm font-medium">
                        Why does Next.js use caching by default?
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500">
                      <span className="hover:text-zinc-700">
                        {projectId ? `${projectId}-1` : "ID-1"} opened 1 minute ago by
                        John Smith
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Field>
                <Label>Description</Label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="Write a short description that explains the purpose of your project (optional)"
                    />
                  )}
                />
              </Field>

              <Field>
                <Label>Workspace</Label>
                <Controller
                  control={control}
                  name="workspace"
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="delayed">Delayed</option>
                      <option value="canceled">Canceled</option>
                    </Select>
                  )}
                />
                <Description>
                  Groups this project with other projects under the same umbrella
                  organization
                </Description>
              </Field>
            </FieldGroup>
          </Fieldset>

          <div className="mx-auto mt-6 flex justify-center">
            <Button className="w-full">Create Project</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewProjectPage
