import NewIssueForm from "@/components/issue/NewIssueForm"

import { getProjects } from "@/server/data/many/get-projects"
import { getUsers } from "@/server/data/many/get-users"
import { getLabels } from "@/server/data/many/get-labels"

export default async function NewIssuePage() {

  const [users, projects, labels] = await Promise.all([
    getUsers(),
    getProjects(),
    getLabels(),
  ])

  return (
    <div className="mx-auto max-w-[1300px] py-8 xl:py-10 ">
       <NewIssueForm users={users} labels={labels} projects={projects} />
    </div>
  )
}