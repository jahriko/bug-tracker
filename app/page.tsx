import { ArrowRightIcon, Bars3Icon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { Button } from '@/components/catalyst/button';
import { getUserDetails } from '@/lib/supabase/auth';
import MobileMenu from './components/MobileMenu';

export default async function LandingPage() {
  const { user } = await getUserDetails();
  return (
    <div className="bg-white h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <MobileMenu />
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8 h-full">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Streamline your project management with TaskFlow
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Efficiently manage tasks, track issues, and collaborate with your
              team. TaskFlow's intuitive interface and powerful features help
              you stay organized and boost productivity across all your
              projects.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {user ? (
                <Button
                  href={`${user.user_metadata.lastWorkspaceUrl}/issues`}
                >
                  <ArrowRightIcon />
                  Go to Dashboard
                </Button>
              ) : (
                <Button href="/login">
                  <ArrowRightIcon />
                  Get started
                </Button>
              )}
            </div>
          </div>
        </div>

        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(60%_100%_at_top_left,white,transparent)]"
        >
          <defs>
            <pattern
              height={200}
              id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
              patternUnits="userSpaceOnUse"
              width={200}
              x="50%"
              y={-1}
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
            height="100%"
            strokeWidth={0}
            width="100%"
          />
        </svg>
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_bottom_right,white,transparent)]"
        >
          <defs>
            <pattern
              height={200}
              id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
              patternUnits="userSpaceOnUse"
              width={200}
              x="50%"
              y={-1}
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
            height="100%"
            strokeWidth={0}
            width="100%"
          />
        </svg>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
