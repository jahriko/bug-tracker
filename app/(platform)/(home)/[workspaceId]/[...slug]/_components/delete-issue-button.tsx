'use client';

import { TrashIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '@/components/catalyst/alert';
import { Button } from '@/components/catalyst/button';
import { deleteIssue } from '../_actions/delete-issue';

export function DeleteIssueButton({
  issueId,
  workspaceId,
}: {
  issueId: number;
  workspaceId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { execute, result, isExecuting } = useAction(deleteIssue, {
    onSuccess: () => {
      setIsOpen(false);
      toast.success('Issue deleted successfully');
      router.push(`/${workspaceId}/issues`);
    },
    onError: (error) => {
      toast.error('Failed to delete issue: ', error);
    },
  });

  const handleDelete = () => {
    execute({ issueId });

    if (result.serverError) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Button
        plain
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <TrashIcon className="size-4" />
        Delete issue
      </Button>
      <Alert
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <AlertTitle>Are you sure you want to delete this issue?</AlertTitle>
        <AlertDescription>
          This action cannot be undone. This will permanently delete the issue
          and all associated data.
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
          <Button color="red" disabled={isExecuting} onClick={handleDelete}>
            <TrashIcon className="size-4" />
            {result.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertActions>
      </Alert>
    </>
  );
}
