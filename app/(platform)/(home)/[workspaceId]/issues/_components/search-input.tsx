'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Input, InputGroup } from '@/components/catalyst/input';

export default function SearchInput({ workspaceId, initialSearch = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 300);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const queryString = createQueryString('search', debouncedSearch);
    router.push(`/${workspaceId}/issues?${queryString}`, { scroll: false });
  }, [debouncedSearch, router, workspaceId, createQueryString]);

  return (
    <InputGroup className="w-full">
      <Input
        aria-label="Search"
        name="search"
        placeholder="Search&hellip;"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </InputGroup>
  );
}
