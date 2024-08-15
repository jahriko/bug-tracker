import { getPrisma } from "@/lib/getPrisma";
import CreateProjectForm from "./create-project-form";
import { getCurrentUser } from "@/lib/get-current-user";
import { notFound } from "next/navigation";

export default async function CreateProjectPage() {
  const session = await getCurrentUser()

  if (!session) {
    notFound()
  }

  const workspaces = await getPrisma(session.userId).workspace.findMany()

  return <CreateProjectForm workspaces={workspaces} />
}