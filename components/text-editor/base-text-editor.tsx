'use client';

import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { type EditorState, type EditorThemeClasses } from 'lexical';
import React from 'react';
import { cn } from '@/lib/utils';

const theme: EditorThemeClasses = {
  ltr: 'ltr',
  rtl: 'rtl',
};

function onError(error) {
  console.error(error);
}

interface BaseTextEditorProps {
  onChange?: (editorState: EditorState) => void;
  initialContent?: string;
  placeholderText?: string;
  isEditable?: boolean;
  className?: string;
  contentEditableClassName?: string;
}

export default function BaseTextEditor({
  onChange,
  initialContent,
  placeholderText,
  isEditable = true,
  className,
  contentEditableClassName,
}: BaseTextEditorProps) {
  const initialConfig = {
    namespace: 'BaseTextEditor',
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
      <div className={cn('relative', className)}>
        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable
              className={cn('outline-none', contentEditableClassName)}
            />
          }
          placeholder={
            <div className="pointer-events-none absolute left-[0.025rem] top-[0.079rem] select-none overflow-hidden text-sm font-normal text-gray-400">
              {placeholderText}
            </div>
          }
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        {onChange ? <OnChangePlugin onChange={onChange} /> : null}
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </div>
    </LexicalComposer>
  );
}
