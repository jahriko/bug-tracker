'use client';

import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
  $createParagraphNode,
  type EditorState,
  type EditorThemeClasses,
  RootNode,
  TextNode,
} from 'lexical';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

const theme: EditorThemeClasses = {
  ltr: 'ltr',
  rtl: 'rtl',
  paragraph: 'mb-1 last:mb-0',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
  },
};

function onError(error) {
  console.error(error);
}

export default function Editor({
  onChange,
  initialContent,
  type,
  placeholderText,
  withBorder,
  isEditable = true,
}: {
  onChange?: (editorState: EditorState) => void;
  initialContent?: string;
  type?: 'description' | 'comment' | 'title' | 'commentBox';
  placeholderText?: string;
  withBorder?: boolean;
  isEditable?: boolean;
}) {
  const initialConfig = {
    namespace: 'Editor',
    theme,
    onError,
    nodes: [
      HorizontalRuleNode,
      CodeNode,
      LinkNode,
      ListNode,
      ListItemNode,
      HeadingNode,
      QuoteNode,
    ],
  };

  return (
    <LexicalComposer
      initialConfig={{
        ...initialConfig,
        editable: isEditable,
        editorState: () => {
          $convertFromMarkdownString(initialContent ?? '', TRANSFORMERS);
        },
      }}
    >
      <span
        className={cn(
          'relative mx-auto max-w-full overflow-hidden bg-white dark:bg-zinc-900 text-left font-normal text-gray-950 dark:text-gray-100',
          withBorder && [
            // Basic layout
            'relative block w-full',
            // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
            'before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-white before:shadow',
            // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
            'dark:before:hidden',
            // Focus ring
            'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-inset after:ring-transparent sm:after:focus-within:ring-2 sm:after:focus-within:ring-blue-500',
            // Disabled state
            'has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none',
          ],
        )}
      >
        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable
              spellCheck={false}
              className={cn(
                type !== 'title' && type !== 'comment' && 'min-h-[100px]',
                type === 'title' && 'text-xl font-semibold',
                withBorder && [
                  // Basic layout
                  'relative block h-full w-full appearance-none rounded-lg px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]',
                  // Typography
                  'text-base/6 text-zinc-950 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-whit sm:text-sm/6',
                  // Border
                  'border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20',
                  // Background color
                  'bg-transparent dark:bg-white/5',
                  // Hide default focus styles
                  'focus:outline-none',
                  // Invalid state
                  'data-[invalid]:border-red-500 data-[invalid]:data-[hover]:border-red-500 data-[invalid]:dark:border-red-600 data-[invalid]:data-[hover]:dark:border-red-600',
                  // Disabled state
                  'disabled:border-zinc-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:data-[hover]:disabled:border-white/15',
                ],
                'lexical prose dark:prose-invert resize-none caret-gray-900 dark:caret-gray-100 outline-none',
              )}
            />
          }
          placeholder={
            <div
              className={cn(
                withBorder
                  ? 'left-3 top-1.5'
                  : 'left-[0.025rem] top-[0.079rem]',
                'pointer-events-none absolute inline-block select-none overflow-hidden text-sm font-normal text-gray-400',
              )}
            >
              {placeholderText}
            </div>
          }
        />
        <LoadInitialContent />
        {type === 'title' ? <SingleLinePlugin /> : null}
        <HistoryPlugin />
        <AutoFocusPlugin />
        {onChange ? <OnChangePlugin onChange={onChange} /> : null}
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </span>
    </LexicalComposer>
  );
}

function LoadInitialContent() {
  // Access the editor through the LexicalComposerContext
  const [editor] = useLexicalComposerContext();
  // Wrap our listener in useEffect to handle the teardown and avoid stale references.
  useEffect(() => {
    // Set the editor to not editable - it won't take focus while in that state
    editor.setEditable(false);

    const unregister = editor.registerNodeTransform(TextNode, (textNode) => {
      console.log('node transformed', textNode);
    });

    // Set the editor back to editable a frame later
    requestAnimationFrame(() => {
      editor.setEditable(true);
    });

    return unregister;
  }, [editor]);
  return null;
}

const newlinesRegex = /[\n\r]/g;

export function SingleLinePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerNodeTransform(RootNode, (rootNode: RootNode) => {
      const nodes = rootNode.getChildren();
      const textContent = rootNode.getTextContent();

      if (newlinesRegex.test(textContent)) {
        const paragraph = $createParagraphNode();
        paragraph.append(...nodes);
        rootNode.clear().append(paragraph);
        rootNode.selectEnd();
      }
    });
  }, [editor]);

  return null;
}
