'use client';
import * as Headless from '@headlessui/react';
import { clsx } from 'clsx';
import { forwardRef, useEffect, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

export const BorderlessTextarea = forwardRef(function Textarea(
  {
    className,
    resizable = true,
    ...props
  }: { className?: string; resizable?: boolean } & Omit<
    Headless.TextareaProps,
    'className'
  >,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
  const texteAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ref = texteAreaRef.current;

    const updateTextareaHeight = () => {
      if (ref) {
        ref.style.height = 'auto';
        ref.style.height = `${ref.scrollHeight}px`;
      }
    };

    updateTextareaHeight();
    ref?.addEventListener('input', updateTextareaHeight);

    return () => ref?.removeEventListener('input', updateTextareaHeight);
  }, []);
  return (
    <span
      data-slot="control"
      className={clsx([
        className,
        // Basic layout
        'relative block w-full',
        // Disabled state
        'has-[[data-disabled]]:opacity-50',
      ])}
    >
      <Headless.Textarea
        ref={mergeRefs([texteAreaRef, ref])}
        {...props}
        className={clsx([
          // Basic layout
          'relative block h-full w-full appearance-none overflow-hidden rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-0 sm:py-[calc(theme(spacing[1.5])-1px)]',
          // Typography
          'text-base/6 text-zinc-950 placeholder:text-zinc-500 dark:text-white sm:text-sm/6',
          // Background color
          'bg-transparent dark:bg-transparent',
          // Hide default focus styles, border, and outline
          'border-none focus:outline-none focus:ring-0',
          // Invalid state (consider alternative indicators)
          'data-[invalid]:text-red-500 dark:data-[invalid]:text-red-400',
          // Disabled state
          'disabled:opacity-50 dark:disabled:opacity-50',
          // Resizable
          resizable ? 'resize-y' : 'resize-none',
        ])}
      />
    </span>
  );
});
