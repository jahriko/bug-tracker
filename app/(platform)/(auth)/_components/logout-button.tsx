'use client';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/(platform)/(auth)/_actions/logout';
import {
  DropdownItem,
  DropdownLabel,
} from '../../../../components/catalyst/dropdown';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <DropdownItem
      onClick={async () => {
        await logout();
        router.push('/login');
      }}
    >
      <ArrowRightStartOnRectangleIcon />
      <DropdownLabel>Sign out</DropdownLabel>
    </DropdownItem>
  );
}
