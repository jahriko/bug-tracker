import { type ReactNode } from 'react';

export default function IssueLayout({
  children,
  issuePreview,
}: {
  children: ReactNode;
  issuePreview: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col pb-2 lg:px-2">
      <div className="flex flex-1 lg:rounded-lg lg:bg-white lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          {children}
      </div>
    </main>
  );
}
