import { UpdateStatusBox } from "@/components/UpdateStatusBox"
import { UpdatePriorityBox } from "@/components/UpdatePriorityBox"
import { UpdateAssigneeBox } from "@/components/UpdateAssigneeBox"
import { UpdateLabelBox } from "@/components/UpdateLabelBox"
import { UpdateProjectBox } from "@/components/UpdateProjectBox"
import { getIssue } from "@/server/data/get-issue"
import { getIssueLabels } from "@/server/data/many/get-issue-labels"
import { getUsers } from "@/server/data/many/get-users"
import { getProjects } from "@/server/data/many/get-projects"
import { getLabels } from "@/server/data/many/get-labels"

export async function IssueFields({ issueId }: { issueId: string }) {
  const [issue, issueLabels, users, projects, labels] = await Promise.all([
    getIssue(Number(issueId)),
    getIssueLabels(Number(issueId)),
    getUsers(),
    getProjects(),
    getLabels(),
  ])
  
  return (
    <aside className="xl:pl-8">
      <div className="space-y-6">
        <div className="flex-row items-center space-y-4">
          <h2 className="text-sm font-medium text-gray-500">Status</h2>
          <UpdateStatusBox issueId={issueId} status={issue.status} />
        </div>

        <div className="flex-row items-center space-y-4">
          <h2 className="text-sm font-medium text-gray-500">Priority</h2>
          <UpdatePriorityBox issueId={issueId} priority={issue.priority} />
        </div>

        <div className="flex-row items-center space-y-4">
          <h2 className="text-sm font-medium text-gray-500">Assignee</h2>
          <UpdateAssigneeBox
            assigneeId={issue.assignee?.id}
            assignees={users}
            issueId={issueId}
          />
        </div>

        <div className="flex-row items-center space-y-4">
          <h2 className="text-sm font-medium text-gray-500">Labels</h2>
          <UpdateLabelBox
            labels={labels}
            issueId={Number(issueId)}
            issueLabels={issueLabels}
          />
        </div>

        <div className="flex-row items-center space-y-4">
          <h2 className="text-sm font-medium text-gray-500">Project</h2>
          <UpdateProjectBox
            projects={projects}
            projectId={issue.project.id}
            issueId={issueId}
          />
        </div>
      </div>
    </aside>
  )
}