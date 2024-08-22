'use client';

import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { type Status } from '@prisma/client';
import {
  Ban,
  CheckCircle2,
  CircleDashed,
  CircleHelp,
  Loader2,
} from 'lucide-react';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useCallback, useState } from 'react';

import { Checkbox } from '@/components/catalyst/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/catalyst/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { COLORS } from '@/lib/colors';
import { classNames } from '@/lib/utils';
import { type IssueDataType } from '../_data/issue-data';

export default function IssueTable({
  issues,
  workspaceId,
}: {
  issues: IssueDataType[];
  workspaceId: string;
}) {
  const [selectedIssues, setSelectedIssues] = useState<any[]>([]);

  const toggleAll = (checked: boolean) => {
    setSelectedIssues(checked ? issues : []);
  };

  const toggleIssue = useCallback((issue: any, checked: boolean) => {
    setSelectedIssues((prev) => {
      return checked ? [...prev, issue] : prev.filter((i) => i.id !== issue.id);
    });
  }, []);

  const handleBulkAction = (action: string) => {
    // Implement bulk action logic here
    console.log(`Bulk ${action} for issues:`, selectedIssues);
  };

  return (
    <Table className="mt-2 [--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
      <TableHead>
        <TableRow>
          <TableCell className="w-0">
            <Checkbox
              checked={selectedIssues.length > 0}
              indeterminate={
                selectedIssues.length > 0 &&
                selectedIssues.length < issues.length
              }
              onChange={(checked) => toggleAll(checked)}
            />
          </TableCell>
          <TableCell className="h-14">
            {selectedIssues.length > 0 ? (
              <div className="flex items-center gap-x-6">
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-gray-900"
                  type="button"
                  onClick={() => handleBulkAction('status')}
                >
                  Status
                  <ChevronDownIcon className="size-4" />
                </button>
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-gray-900"
                  type="button"
                  onClick={() => handleBulkAction('assign')}
                >
                  Assign
                  <ChevronDownIcon className="size-4" />
                </button>
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-gray-900"
                  type="button"
                  onClick={() => handleBulkAction('priority')}
                >
                  Priority
                  <ChevronDownIcon className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-x-6 text-xs text-gray-500">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex cursor-pointer items-center gap-x-1">
                        <CircleDashed className="size-4 text-zinc-500" />
                        {
                          issues.filter((issue) => issue.status === 'BACKLOG')
                            .length
                        }
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Backlog</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex cursor-pointer items-center gap-x-1">
                        <Loader2 className="size-4 text-yellow-700" />
                        {
                          issues.filter(
                            (issue) => issue.status === 'IN_PROGRESS',
                          ).length
                        }
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>In Progress</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex cursor-pointer items-center gap-x-1">
                        <CheckCircle2 className="size-4 text-indigo-700" />
                        {
                          issues.filter((issue) => issue.status === 'DONE')
                            .length
                        }
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Done</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex cursor-pointer items-center gap-x-1">
                        <Ban className="size-4 text-zinc-500" />
                        {
                          issues.filter((issue) => issue.status === 'CANCELLED')
                            .length
                        }
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Cancelled</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id} className="group">
            <TableCell>
              <Checkbox
                checked={selectedIssues.some((i) => i.id === issue.id)}
                onChange={(checked) => toggleIssue(issue, checked)}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-start gap-x-2">
                <div className="flex-shrink-0">
                  {renderStatus(issue.status)}
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Link
                      className="cursor-pointer text-wrap font-medium leading-tight hover:text-blue-700"
                      href={`/${workspaceId}/issue/${issue.project.identifier}-${issue.id}`}
                      prefetch={false}
                    >
                      {issue.title}
                    </Link>
                    {issue.labels.map((label) => (
                      <span
                        key={label.label.id}
                        className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-2xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200"
                      >
                        <div
                          className={classNames(
                            COLORS[label.label.color] || 'bg-zinc-100',
                            'flex-none rounded-full p-1',
                          )}
                        >
                          <div className="size-2 rounded-full bg-current" />
                        </div>
                        {label.label.name}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    <span className="hover:text-zinc-700">
                      {issue.project.identifier}-{issue.id} opened{' '}
                      {DateTime.fromJSDate(issue.createdAt).toRelative()} by{' '}
                      {issue.owner?.name}
                    </span>
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function renderStatus(status: Status) {
  switch (status) {
    case 'BACKLOG':
      return <CircleDashed className="size-[1.10rem] text-zinc-500" />;
    case 'IN_PROGRESS':
      return <Loader2 className="size-[1.10rem] text-yellow-700" />;
    case 'DONE':
      return <CheckCircle2 className="size-[1.10rem] text-indigo-700" />;
    case 'CANCELLED':
      return <Ban className="size-[1.10rem] text-zinc-500" />;
    default:
      return <CircleHelp className="size-[1.10rem] text-zinc-500" />;
  }
}
