import { UserPlusIcon } from '@heroicons/react/16/solid';
import { type Role } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import { Button } from '@/components/catalyst/button';
import { getCurrentUser } from '@/lib/get-current-user';
import prisma from '@/lib/prisma';

// Helper function to determine role order
const roleOrder: Record<Role, number> = {
  ADMIN: 1,
  MEMBER: 3,
};

export default async function MembersPage({
  params,
}: {
  params: {
    workspaceId: string;
  };
}) {
  const { workspaceId } = params;

  const session = await getCurrentUser();
  if (!session) {
    redirect('/login');
  }

  const workspace = await prisma.workspace.findUnique({
    where: {
      url: workspaceId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!workspace) {
    notFound();
  }

  // Sort members by role and then by name
  const sortedMembers = workspace.members.sort((a, b) => {
    // First, sort by role
    const roleComparison = roleOrder[a.role] - roleOrder[b.role];
    if (roleComparison !== 0) return roleComparison;

    // If roles are the same, sort by name
    return a.user.name.localeCompare(b.user.name);
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Workspace Members
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Manage members of your workspace.
          </p>
        </div>
        <Button>
          <UserPlusIcon />
          Invite people
        </Button>
      </div>

      <ul className="mt-6 divide-y divide-gray-100" role="list">
        {sortedMembers.map((member) => (
          <li
            key={member.user.email}
            className="flex items-center gap-x-4 py-5"
          >
            <img
              alt=""
              className="size-8 flex-none rounded-full bg-gray-50"
              src={
                member.user.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(member.user.name)}`
              }
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {member.user.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {member.user.email}
              </p>
            </div>
            {member.role === 'ADMIN' && (
              <div className="ml-auto">
                <span className="inline-flex items-center text-xs text-zinc-500">
                  {member.role.charAt(0).toUpperCase() +
                    member.role.slice(1).toLowerCase()}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
