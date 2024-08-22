'use client';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { PlusIcon, TagIcon } from '@heroicons/react/16/solid';
import { useOptimisticAction } from 'next-safe-action/hooks';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import MultiSelectComboBox, {
  MultiSelectComboBoxLabel,
  MultiSelectComboBoxOption,
  type MultiSelectComboBoxProps,
  MultiSelectComboboxOptions,
} from '@/app/(platform)/(home)/[workspaceId]/_components/combobox-multi-select';
import { type BadgeProps } from '@/components/catalyst/badge';
import { BorderlessInput } from '@/components/catalyst/borderless-input';
import { Button } from '@/components/catalyst/button';
import { Dialog, DialogBody } from '@/components/catalyst/dialog';
import { Divider } from '@/components/catalyst/divider';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { COLORS } from '@/lib/colors';
import { classNames } from '@/lib/utils';
import { type LabelsData } from '@/server/data/many/get-labels';
import { createLabel } from '../_actions/create-label';

export function LabelSelector<T, V extends boolean | undefined>({
  labels,
  asChild,
  renderButtonAsIcon,
  ...rest
}: {
  labels: LabelsData;
  renderButton?: boolean;
} & MultiSelectComboBoxProps<T, V>) {
  const [query, setQuery] = useState('');
  const [colorQuery, setColorQuery] = useState('');
  const [isCreateLabelDialogOpen, setCreateLabelDialogOpen] = useState(false);

  const form = useForm<{ color: string }>({
    defaultValues: { color: '' },
  });

  const { execute, result, optimisticState } = useOptimisticAction(
    createLabel,
    {
      currentState: { labels },
      updateFn: (state, newLabel) => ({
        labels: [...state.labels, { ...newLabel, available: true }],
      }),
      onError: ({ error, input }) => {
        console.error('[Action Error]: ', error, input);
      },
      onExecute: ({ input }) => {
        setQuery('');
        setCreateLabelDialogOpen(false);
        toast.success('Label created', { description: input.name });
      },
    },
  );

  const filteredColors = useMemo(() => {
    const validColors = Object.keys(COLORS) as BadgeProps['color'][];
    if (colorQuery === '') return validColors;
    return validColors.filter((color) =>
      color.toLowerCase().includes(colorQuery.toLowerCase()),
    );
  }, [colorQuery]);

  const filteredLabels = useMemo(() => {
    if (query === '') return optimisticState.labels;
    return optimisticState.labels.filter((label) =>
      label.name.toLowerCase().includes(query.toLowerCase().trim()),
    );
  }, [query, optimisticState.labels]);

  const handleCreateLabel = (color: string) => {
    execute({
      id: Math.random(),
      name: query,
      color,
    });

    if (result.serverError) {
      console.error('Error creating label: ', result.serverError);
    }
  };

  const renderColorOption = (color: string) => (
    <ComboboxOption
      key={color}
      value={color}
      className={({ active }) =>
        classNames(
          'flex cursor-default select-none items-center gap-x-3 rounded-md px-4 py-3',
          active ? 'bg-gray-100' : '',
        )
      }
      onClick={() =>
        form.handleSubmit(() => {
          handleCreateLabel(color);
        })()
      }
    >
      <div
        className={classNames(
          COLORS[color] || 'bg-zinc-100',
          'flex-none rounded-full p-1',
        )}
      >
        <div className="size-2.5 rounded-full bg-current" />
      </div>
      {color.charAt(0).toUpperCase() + color.slice(1)}
    </ComboboxOption>
  );

  return (
    <MultiSelectComboBox
      {...rest}
      multiple
      name="labels"
      renderButtonAsIcon={renderButtonAsIcon}
      placeholder={
        renderButtonAsIcon ?? (
          <div className="flex items-center gap-x-2 text-zinc-500 lg:text-xs">
            <TagIcon className="flex size-4" />
            Labels
          </div>
        )
      }
      onQueryChange={setQuery}
    >
      <MultiSelectComboboxOptions hold static>
        <div className="p-1">
          {filteredLabels.map((label) => (
            <MultiSelectComboBoxOption
              key={label.id}
              disabled={label.available}
              value={label}
            >
              <div
                className={classNames(
                  COLORS[label.color] || 'bg-zinc-100',
                  'flex-none rounded-full p-1',
                )}
              >
                <div className="size-2 rounded-full bg-current" />
              </div>
              {/* <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: label.color }} /> */}
              <MultiSelectComboBoxLabel className="font-medium">
                {label.name}
              </MultiSelectComboBoxLabel>
            </MultiSelectComboBoxOption>
          ))}

          {filteredLabels.length === 0 && (
            <>
              <Button
                plain
                className="relative w-full"
                onClick={() => {
                  setCreateLabelDialogOpen(true);
                }}
                onMouseDown={(event: React.MouseEvent) => {
                  event.preventDefault();
                }}
              >
                <PlusIcon />
                <span className="font-medium">Create new label</span>
                <span className="font-normal text-zinc-500">{query}</span>
              </Button>

              <Dialog
                className="!p-4"
                open={isCreateLabelDialogOpen}
                onClose={() => {
                  setQuery('');
                  setCreateLabelDialogOpen(false);
                }}
              >
                <DialogBody className="!mt-0">
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Combobox {...field} as="div">
                              <ComboboxInput
                                autoFocus
                                as={BorderlessInput}
                                className="w-full border-0 px-4 py-2.5 text-gray-900 focus:ring-0 sm:text-sm"
                                placeholder="Select a color for your label"
                                onBlur={() => {
                                  setColorQuery('');
                                }}
                                onChange={(event) => {
                                  setColorQuery(event.target.value);
                                }}
                              />

                              <Divider />

                              {Object.keys(COLORS).length > 0 && (
                                <ComboboxOptions
                                  static
                                  className="-mb-2 max-h-72 scroll-py-6 overflow-y-auto py-2 text-sm text-gray-800"
                                >
                                  {filteredColors.map(renderColorOption)}
                                </ComboboxOptions>
                              )}

                              {colorQuery !== '' &&
                                filteredColors.length === 0 && (
                                  <div className="px-4 py-14 text-center sm:px-14">
                                    <p className="mt-4 text-sm text-gray-900">
                                      No color found.
                                    </p>
                                  </div>
                                )}
                            </Combobox>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </Form>
                </DialogBody>
              </Dialog>
            </>
          )}
        </div>
      </MultiSelectComboboxOptions>
    </MultiSelectComboBox>
  );
}
