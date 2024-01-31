import NewIssueForm from "@/app/(platform)/(home)/new-issue/NewIssueForm";

import { getProjects } from "@/server/data/get-projects";
import { getUsers } from "@/server/data/get-users";
import { getLabels } from "@/server/data/get-labels";

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