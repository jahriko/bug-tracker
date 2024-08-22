import { PlusIcon } from '@heroicons/react/16/solid';
import { redirect } from 'next/navigation';
import { Avatar } from '@/components/catalyst/avatar';
import { Link } from '@/components/catalyst/link';
import { getCurrentUser } from '@/lib/get-current-user';
import { getPrisma } from '@/lib/getPrisma';
import TeamSettings from './_components/team-settings';

export default async function ProjectsPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const projects = await getPrisma(user.userId).project.findMany({
    include: {
      _count: {
        select: {
          members: true,
        },
      },
      members: {
        select: {
          user: {
            select: {
              id: true,
              image: true,
              email: true,
              name: true,
            },
          },
        },
      },
      workspace: {
        select: {
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              role: true,
            },
          },
        },
      },
    },
  });

  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
        <div className="mx-auto max-w-6xl">
          <ul
            className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
            role="list"
          >
            <li className="flex">
              <Link
                href={`/${params.workspaceId}/create-project`}
                className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                // type="button"
              >
                <PlusIcon className="h-12 w-12 text-gray-500" />
                <span className="mt-2 block text-sm font-medium text-gray-500">
                  Create a new project
                </span>
              </Link>
            </li>
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex overflow-hidden rounded-xl border border-gray-200"
              >
                <div className="flex w-full flex-col">
                  <div className="relative m-1 flex h-28 gap-x-4">
                    <div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' width='80' height='80'%3E%3Cg fill='%239C92AC' fill-opacity='0.8'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' opacity='.5'%3E%3C/path%3E%3Cpath d='M15 15h50l-5 5H20v40l-5 5V15zm0 50h50V15L80 0v80H0l15-15zm32.07-32.07l3.54-3.54A15 15 0 0 1 29.4 50.6l3.53-3.53a10 10 0 1 0 14.14-14.14zM32.93 47.07a10 10 0 1 1 14.14-14.14L32.93 47.07z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`,
                        maskImage:
                          'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
                        WebkitMaskImage:
                          'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
                      }}
                    />
                  </div>
                  <div className="mt-auto flex items-center justify-between px-6 py-6">
                    <TeamSettings
                      projectDetails={project}
                      projectMembers={project.members}
                      workspaceMembers={project.workspace?.members ?? []}
                    />

                    <AvatarGroup avatars={project.members} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

function AvatarGroup({ avatars, limit = 4 }) {
  const visibleAvatars = avatars.slice(0, limit);
  const remainingCount = Math.max(avatars.length - limit, 0);

  return (
    <dd className="flex items-start gap-x-2">
      <div className="flex -space-x-1 overflow-hidden">
        {visibleAvatars.map((avatar, index) => (
          <Avatar
            className="size-7 ring-2 ring-white dark:ring-zinc-900"
            src={avatar.user.image}
          />
        ))}

        {remainingCount > 0 && (
          <Avatar
            className="size-7 bg-zinc-50 text-2xs ring-2 ring-white dark:ring-zinc-900"
            initials="+4"
          />
        )}
      </div>
    </dd>
  );
}
