'use client';

// import { DocumentTextIcon, MapIcon, RectangleStackIcon } from "@heroicons/react/24/outline"
import {
  ChatBubbleBottomCenterTextIcon,
  CubeIcon,
  DocumentTextIcon,
  RectangleStackIcon,
} from '@heroicons/react/16/solid';
import { usePathname } from 'next/navigation';
import { NavbarItem } from '@/components/catalyst/navbar';

export default function NavbarLinks() {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const workspaceSlug = segments[1]; // Assuming workspace slug is the first segment

  return (
    <>
      <NavbarItem
        key="issues"
        current={segments[2] === 'issues'}
        href={`/${workspaceSlug}/issues`}
      >
        <CubeIcon className="h-4 w-4" />
        Issues
      </NavbarItem>
      <NavbarItem
        key="discussions"
        current={segments[2] === 'discussions'}
        href={`/${workspaceSlug}/discussions`}
      >
        <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
        Discussions
      </NavbarItem>
      <NavbarItem
        key="projects"
        current={segments[2] === 'projects'}
        href={`/${workspaceSlug}/projects`}
      >
        <RectangleStackIcon className="h-4 w-4" />
        Projects
      </NavbarItem>
    </>
  );
}
