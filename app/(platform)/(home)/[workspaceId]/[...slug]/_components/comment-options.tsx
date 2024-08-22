'use client';
import {
  EllipsisHorizontalIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid';
import { DateTime } from 'luxon';
import { useState } from 'react';
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '@/components/catalyst/alert';
import { Avatar } from '@/components/catalyst/avatar';
import { Button } from '@/components/catalyst/button';
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/catalyst/dropdown';
import Editor from '@/components/lexical_editor/editor';
import { deleteComment } from '../_actions/delete-comment';

function timeAgo(dateTime: DateTime) {
  const now = DateTime.now();
  const diffInSeconds = now.diff(dateTime, 'seconds').seconds;

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 120) {
    return 'a minute ago';
  }
  return dateTime.toRelative(now);
}

export default function CommentOptions({ item, comment }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dropdown>
        <DropdownButton plain aria-label="More options">
          <EllipsisHorizontalIcon />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <TrashIcon />
            <DropdownLabel>Delete</DropdownLabel>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Alert open={isOpen} onClose={setIsOpen}>
        <AlertTitle>Are you sure you want to delete this comment?</AlertTitle>
        <AlertDescription>
          <div className="relative flex gap-x-4">
            <div className="relative mt-3 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-200">
              {item.user ? (
                <Avatar
                  alt={item.user.name}
                  className="size-5"
                  src={item.user.image}
                />
              ) : (
                <UserCircleIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-gray-500"
                />
              )}
            </div>
            <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
              <div className="flex justify-between">
                <div className="flex gap-x-1">
                  <div className="py-0.5 text-xs leading-5 text-gray-500">
                    <span className="font-semibold text-gray-900">
                      {item.user.name}
                    </span>
                  </div>
                </div>
              </div>
              <Editor
                initialContent={comment}
                isEditable={false}
                type="comment"
              />
            </div>
          </div>
        </AlertDescription>
        <AlertActions>
          <Button
            plain
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={async () => {
              await deleteComment({
                commentId: item.commentId,
                activityId: item.id,
                issueId: item.issueId,
              });
              setIsOpen(false);
            }}
          >
            <TrashIcon />
            Delete comment
          </Button>
        </AlertActions>
      </Alert>
    </>
  );
}
