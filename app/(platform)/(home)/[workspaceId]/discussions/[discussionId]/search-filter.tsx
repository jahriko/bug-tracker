'use client';

import { type Project } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SearchFilter({
  projects,
  workspaceMembers,
}: {
  projects: Project[];
  workspaceMembers: {
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [project, setProject] = useState(searchParams.get('project') || 'all');
  const [user, setUser] = useState(searchParams.get('user') || 'all');
  const [timeFilter, setTimeFilter] = useState(
    searchParams.get('time') || 'all',
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (project !== 'all') params.set('project', project);
    else params.delete('project');
    if (user !== 'all') params.set('user', user);
    else params.delete('user');
    if (timeFilter !== 'all') params.set('time', timeFilter);
    else params.delete('time');

    router.push(`?${params.toString()}`);
  }, [project, user, timeFilter, router, searchParams]);

  return (
    <div className="flex space-x-4">
      <Select value={project} onValueChange={setProject}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((proj) => (
            <SelectItem key={proj.id.toString()} value={proj.id.toString()}>
              {proj.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={user} onValueChange={setUser}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by user" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          {workspaceMembers.map((member) => (
            <SelectItem key={member.user.id} value={member.user.id}>
              {member.user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={timeFilter} onValueChange={setTimeFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Latest Activity</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="last_week">Last Week</SelectItem>
          <SelectItem value="last_month">Last Month</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
