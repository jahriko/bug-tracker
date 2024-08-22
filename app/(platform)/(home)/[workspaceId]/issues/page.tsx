import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import { notFound } from 'next/navigation';
import { InputGroup } from '@/components/catalyst/input';
import { getCurrentUser } from '@/lib/get-current-user';
import prisma from '@/lib/prisma';
import { NoIssuesFound } from './_components/NoIssuesFound';
import { TablePagination } from './_components/TablePagination';
import IssueTable from './_components/issue-table';
import NewIssueDialog from './_components/new-issue-dialog';
import SearchInput from './_components/search-input';
import { getIssuesData } from './_data/issue-data';
import { getWorkspaceData } from './_data/workspace-data';
import {
  getPaginationData,
  parseSearchParams,
  updateLastWorkspaceUrl,
} from './helpers';

export default async function IssuePage({
  params,
  searchParams,
}: {
  params: { workspaceId: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getCurrentUser();
  if (!session) notFound();

  await updateLastWorkspaceUrl(session, params.workspaceId);

  const { page, pageSize, filter, status, priority, search } =
    parseSearchParams(searchParams);

  const workspaceData = await getWorkspaceData(
    session.userId,
    params.workspaceId,
  );
  if (!workspaceData) notFound();

  const projectIds = workspaceData.projects.map((p) => p.id);
  const { issues, totalIssues } = await getIssuesData(
    session.userId,
    projectIds,
    page,
    pageSize,
    filter,
    status,
    priority,
    search,
  );

  const projectMembers = workspaceData.projects.flatMap((p) =>
    p.members.map((m) => m.user),
  );

  const labels = await prisma.label.findMany();

  const paginationData = getPaginationData(page, totalIssues, pageSize);

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-x-2">
            <div className="flex-grow">
              <InputGroup className="w-full">
                <MagnifyingGlassIcon />
                <SearchInput
                  initialSearch={search}
                  workspaceId={params.workspaceId}
                />
              </InputGroup>
            </div>
            <NewIssueDialog
              assignees={projectMembers}
              hasProjects={workspaceData.projects.length > 0}
              labels={labels}
              projects={workspaceData.projects}
            />
          </div>
          <div className="py-6">
            <main>
              <div>
                {issues.length > 0 ? (
                  <>
                    <IssueTable
                      issues={issues}
                      workspaceId={params.workspaceId}
                    />
                    <TablePagination {...paginationData} />
                  </>
                ) : (
                  <NoIssuesFound search={search} />
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}
