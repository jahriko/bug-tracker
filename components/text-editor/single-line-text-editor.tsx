'use client';

import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, RootNode } from 'lexical';
import BaseTextEditor from './base-text-editor';
import { cn } from '@/lib/utils';

function SingleLinePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
      const nodes = rootNode.getChildren();
      const textContent = rootNode.getTextContent();

      if (/[\n\r]/.test(textContent)) {
        const paragraph = $createParagraphNode();
        paragraph.append(...nodes);
        rootNode.clear().append(paragraph);
        rootNode.selectEnd();
      }
    });
  }, [editor]);

  return null;
}

export default function SingleLineTextEditor(props) {
  return (
    <BaseTextEditor
      {...props}
      className={cn(
        'relative mx-auto max-w-full overflow-hidden bg-white text-left font-normal text-gray-950',
      )}
      contentEditableClassName={cn(
        'text-xl font-semibold',
        'relative block h-full w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',
        'text-base/6 text-zinc-950 placeholder:text-zinc-500 dark:text-white sm:text-sm/6',
        'bg-transparent dark:bg-white/5',
        'focus:outline-none',
        'lexical prose resize-none caret-gray-900 outline-none',
      )}
    >
      <SingleLinePlugin />
    </BaseTextEditor>
  );
}