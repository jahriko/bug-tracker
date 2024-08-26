import BaseTextEditor from './base-text-editor';
import { cn } from '@/lib/utils';

export default function BorderedTextEditor(props) {
  return (
    <BaseTextEditor
      {...props}
      className={cn(
        'relative mx-auto max-w-full overflow-hidden bg-white text-left font-normal text-gray-950',
        'before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow',
        'dark:before:hidden',
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-blue-500',
        'has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none',
      )}
      contentEditableClassName={cn(
        'min-h-[100px]',
        'relative block h-full w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',
        'text-base/6 text-zinc-950 placeholder:text-zinc-500 dark:text-white sm:text-sm/6',
        'border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20',
        'bg-transparent dark:bg-white/5',
        'focus:outline-none',
        'data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600',
        'disabled:border-zinc-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:data-[hover]:disabled:border-white/15',
        'lexical prose resize-none caret-gray-900 outline-none',
      )}
    />
  );
}