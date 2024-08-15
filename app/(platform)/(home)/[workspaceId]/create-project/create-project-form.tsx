"use client"
import { Button } from "@/components/catalyst/button"
import { Description, Field, FieldGroup, Fieldset, Label } from "@/components/catalyst/fieldset"
import { Heading } from "@/components/catalyst/heading"
import { Input } from "@/components/catalyst/input"
import { Select } from "@/components/catalyst/select"
import { Text } from "@/components/catalyst/text"
import { Textarea } from "@/components/catalyst/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Workspace } from "@prisma/client"
import { CircleDashed } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { createProject } from "./_actions/create-project"

import { flattenValidationErrors } from "next-safe-action"
import { toast } from "sonner"

const schema = z.object({
  name: z.string().min(2, { message: "Project name is required" }),
  projectId: z.string().min(1, { message: "Project ID is required" }).max(3),
  description: z.string().optional(),
  workspace: z.string(),
})

type FormData = z.infer<typeof schema>

const useProjectForm = () => {
  const [isProjectIdManuallyEdited, setIsProjectIdManuallyEdited] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      projectId: "",
      description: "",
      workspace: "Unassigned",
    },
  })

  const projectId = watch("projectId")

  const generateProjectId = (name: string): string => {
    const words = name.trim().split(/\s+/)
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
    const newValue = e.target.value.trim()
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

  const { execute, status, result } = useAction(createProject)

  const onSubmit = (data: FormData) => {
    execute({
      identifier: data.projectId,
      name: data.name,
      description: data.description,
      workspaceUrl: pathname.split("/")[1],
    })

    if (result.validationErrors) {
      const flattenedErrors = flattenValidationErrors(result.validationErrors)
      if (flattenedErrors.formErrors.length > 0) {
        toast.error(flattenedErrors.formErrors[0])
      } else if (Object.keys(flattenedErrors.fieldErrors).length > 0) {
        const firstFieldError = Object.values(flattenedErrors.fieldErrors)[0]
        if (Array.isArray(firstFieldError) && firstFieldError.length > 0) {
          toast.error(firstFieldError[0])
        }
      }
      return
    }

    if (result.data?.success) {
      router.push(`/${data.workspace}/${data.projectId}`)
    }
  }

  return {
    control,
    handleSubmit,
    errors,
    projectId,
    handleNameChange,
    handleProjectIdChange,
    onSubmit,
    status,
    result,
  }
}

const FormField = ({
  name,
  label,
  error,
  children,
}: {
  name: keyof FormData
  label: string
  error?: string | undefined
  children: React.ReactNode
}) => (
  <Field>
    <Label>{label}</Label>
    {children}
    {error ? <span className="text-sm text-red-500">{error}</span> : null}
  </Field>
)

const CreateProjectForm = ({ workspaces }: { workspaces: Workspace[] }) => {
  const { control, handleSubmit, errors, projectId, handleNameChange, handleProjectIdChange, onSubmit, status } =
    useProjectForm()

  return (
    <main className="relative isolate flex flex-1 flex-col bg-white pb-2 lg:px-2">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(70%_100%_at_top_left,white,transparent)]"
      >
        <defs>
          <pattern
            height={200}
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            patternUnits="userSpaceOnUse"
            width={200}
            x="50%"
            y={-1}
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" height="100%" strokeWidth={0} width="100%" />
      </svg>
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(70%_100%_at_bottom_right,white,transparent)]"
      >
        <defs>
          <pattern
            height={200}
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            patternUnits="userSpaceOnUse"
            width={200}
            x="50%"
            y={-1}
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" height="100%" strokeWidth={0} width="100%" />
      </svg>
      <div className="grow p-6 lg:rounded-lg lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-6xl">
          <div className="p-6 text-gray-800">
            <div className="mx-auto max-w-xl">
              <Heading>Create Project</Heading>
              <Text className="mb-6">
                Personalize your project to help other users understand its purpose and scope. You can update these
                values from the General Info tab in the project settings if needed.
              </Text>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Fieldset aria-label="Project details">
                  <FieldGroup>
                    <FormField error={errors.name?.message} label="Name" name="name">
                      <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <Input {...field} onChange={handleNameChange} placeholder="Enter a name for your project" />
                        )}
                      />
                    </FormField>

                    <FormField error={errors.projectId?.message} label="Project ID" name="projectId">
                      <Controller
                        control={control}
                        name="projectId"
                        render={({ field }) => (
                          <Input {...field} onChange={handleProjectIdChange} placeholder="Enter project ID" />
                        )}
                      />
                      <Description>
                        Used as a prefix in IDs for issues and articles that belong to this project
                      </Description>
                    </FormField>

                    <div>
                      <p className="mb-1 text-xs text-gray-400">Preview</p>
                      <div className="mb-6 flex items-center gap-4 rounded bg-gray-50 p-3 shadow ring-1 ring-gray-100">
                        <div>
                          <div className="flex items-center gap-x-3 gap-y-4">
                            <CircleDashed className="size-[1.10rem] text-zinc-500 hover:text-black" />
                            <div className="text-sm font-medium">Why does Next.js use caching by default?</div>
                          </div>
                          <div className="text-xs text-zinc-500">
                            <span className="hover:text-zinc-700">
                              {projectId ? `${projectId}-1` : "ID-1"} opened 1 minute ago by John Smith
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <FormField label="Description" name="description">
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
                    </FormField>

                    <FormField label="Workspace" name="workspace">
                      <Controller
                        control={control}
                        name="workspace"
                        render={({ field }) => (
                          <Select {...field}>
                            {workspaces.map((workspace) => (
                              <option key={workspace.id} value={workspace.id}>
                                {workspace.name}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      <Description>
                        Groups this project with other projects under the same umbrella organization
                      </Description>
                    </FormField>
                  </FieldGroup>
                </Fieldset>

                <div className="mx-auto mt-6 flex justify-center">
                  <Button className="w-full" disabled={status === "executing"}>
                    {status === "executing" ? "Creating..." : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CreateProjectForm
