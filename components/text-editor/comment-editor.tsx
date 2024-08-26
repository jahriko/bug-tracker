'use client';

import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  type EditorState,
  FORMAT_TEXT_COMMAND,
} from 'lexical';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/catalyst/button';
import { useAction } from 'next-safe-action/hooks';
import { addDiscussionComment } from '@/app/(platform)/(home)/[workspaceId]/discussions/[discussionId]/_actions/add-discussion-comment';
import { addComment } from '@/app/(platform)/(home)/[workspaceId]/[...slug]/_actions/add-comment';
import { ImageNode } from './nodes/ImageNode';
import { CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { Icons } from '../icons';

function Placeholder() {
  return (
    <div className="absolute top-0 left-0 text-sm text-gray-400 pointer-events-none select-none overflow-hidden">
      Enter your comment...
    </div>
  );
}
const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';
type CommentEditorProps = {
  discussionId?: number;
  issueId?: number;
  lastActivity: { activityType: string; activityId: number };
};

export function CommentEditor({
  discussionId,
  issueId,
  lastActivity,
}: CommentEditorProps) {
  const [comment, setComment] = useState('');
  const { execute: executeDiscussion, isExecuting: isExecutingDiscussion } =
    useAction(addDiscussionComment);
  const { execute: executeIssue, isExecuting: isExecutingIssue } =
    useAction(addComment);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const initialConfig = {
    namespace: 'CommentEditor',
    onError: (error: Error) => console.error(error),
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      AutoLinkNode,
      LinkNode,
      ImageNode,
    ],
  };

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      setComment(markdown);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      if (discussionId) {
        executeDiscussion({ content: comment, discussionId });
      } else if (issueId) {
        executeIssue({ commentBody: comment, issueId, lastActivity });
      }
      setComment('');
    }
  };

  const isExecuting = isExecutingDiscussion || isExecutingIssue;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="border rounded-lg p-4">
          <div className="relative">
            <RichTextPlugin
              ErrorBoundary={LexicalErrorBoundary}
              placeholder={<Placeholder />}
              contentEditable={
                <ContentEditable className="outline-none text-sm" />
              }
            />
            <OnChangePlugin onChange={handleChange} />
            <HistoryPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <div className="flex justify-end mt-2">
              <Button type="submit" disabled={isExecuting}>
                {isExecuting ? (
                  <Icons.spinner className="animate-spin h-4 w-4" />
                ) : null}
                Comment
              </Button>
            </div>
          </div>
        </div>
      </LexicalComposer>
    </form>
  );
}
