'use client';

import { XMarkIcon } from '@heroicons/react/16/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface Category {
  id: string;
  name: string;
  emoji: string;
}

interface CategorySelectorProps {
  categories: Category[];
  initialCategory?: string;
}

export default function CategorySelector({
  categories,
  initialCategory,
}: CategorySelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleCategory = useCallback(
    (categoryName: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (categoryName === initialCategory) {
        params.delete('category');
      } else {
        params.set('category', categoryName);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams, initialCategory],
  );

  return (
    <ul className="flex flex-col space-y-1">
      {categories.map((category) => {
        const isSelected = initialCategory === category.name;
        return (
          <li key={category.id}>
            <button
              className={`flex w-full items-center justify-between whitespace-nowrap rounded-lg p-2 ${
                isSelected ? 'bg-zinc-100 text-zinc-950' : 'hover:bg-zinc-100'
              }`}
              onClick={() => {
                toggleCategory(category.name);
              }}
            >
              <div className="flex items-center gap-x-2">
                <span className="inline-block flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 fill-current text-sm text-emerald-500">
                  {category.emoji}
                </span>
                <span className="inline-block text-sm font-medium">
                  {category.name}
                </span>
              </div>
              {isSelected ? (
                <XMarkIcon className="h-4 w-4 text-zinc-400 hover:text-zinc-500" />
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}