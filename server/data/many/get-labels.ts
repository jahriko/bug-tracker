import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"

const labelSelect = {
  id: true,
  name: true,
  color: true,
} satisfies Prisma.LabelSelect

export type Label = Prisma.LabelGetPayload<{
  select: typeof labelSelect
}>

export async function getLabels() {
  const labels = await prisma.label.findMany({
    select: labelSelect,
  })

  return labels
}