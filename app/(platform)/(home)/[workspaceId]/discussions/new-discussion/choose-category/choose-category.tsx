'use client';

import { RadioGroup } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/catalyst/button';

interface Category {
  id: number;
  name: string;
  description: string | null;
  emoji: string | null;
}

interface CategorySelectorProps {
  categories: Category[];
  workspaceId: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function CategorySelector({
  categories,
  workspaceId,
}: CategorySelectorProps) {
  const [selected, setSelected] = useState<Category | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selected) {
      router.push(
        `/${workspaceId}/discussions/new-discussion?categoryId=${selected.id}`,
      );
    }
  };

  return (
    <div>
      <RadioGroup value={selected} onChange={setSelected}>
        <RadioGroup.Label className="sr-only">
          Discussion category
        </RadioGroup.Label>
        <div className="space-y-4">
          {categories.map((category) => (
            <RadioGroup.Option
              key={category.id}
              value={category}
              className={({ checked, active }) =>
                classNames(
                  checked ? 'border-transparent' : 'border-gray-300',
                  active ? 'border-indigo-600 ring-2 ring-indigo-600' : '',
                  'relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between',
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <span className="flex items-center">
                    {category.emoji ? (
                      <span className="mr-3 text-2xl">{category.emoji}</span>
                    ) : null}
                    <span className="flex flex-col text-sm">
                      <RadioGroup.Label
                        as="span"
                        className="font-medium text-gray-900"
                      >
                        {category.name}
                      </RadioGroup.Label>
                      {category.description ? (
                        <RadioGroup.Description
                          as="span"
                          className="text-gray-500"
                        >
                          {category.description}
                        </RadioGroup.Description>
                      ) : null}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      active ? 'border' : 'border-2',
                      checked ? 'border-indigo-600' : 'border-transparent',
                      'pointer-events-none absolute -inset-px rounded-lg',
                    )}
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <div className="mt-6">
        <Button
          className="w-full"
          disabled={!selected}
          type="button"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
