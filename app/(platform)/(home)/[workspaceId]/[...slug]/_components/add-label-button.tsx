'use client';
import { useState } from 'react';
import { type LabelsData } from '@/server/data/many/get-labels';
import { LabelSelector } from '../../_components/label-selector';
import { addIssueLabel } from '../_actions/add-issue-label';
import { removeIssueLabel } from '../_actions/remove-issue-label';
import { IssueByProject, type IssueActivityList } from '../_data/issue';
import { IssueLabel } from '@prisma/client';

export default function AddLabelButton({
  labels,
  issueId,
  issueLabels,
  activities,
}: {
  labels: LabelsData;
  issueId: number;
  issueLabels: IssueByProject['labels'];
  activities: Extract<
    IssueActivityList[number],
    { issueActivity: 'LabelActivity' }
  >[];
}) {
  const [selected, setSelected] = useState(
    issueLabels.map((issueLabel) => issueLabel.label),
  );

  const handleLabelChange = async (newSelectedOptions: LabelsData) => {
    const addedOption = newSelectedOptions.find(
      (option) => !selected.includes(option),
    );
    const removedOption = selected.find(
      (option) => !newSelectedOptions.includes(option),
    );

    setSelected(newSelectedOptions);

    if (addedOption) {
      await addIssueLabel({ issueId, labelId: addedOption.id });
    }

    if (removedOption) {
      await removeIssueLabel({ issueId, labelId: removedOption.id });
    }
  };

  return (
    <LabelSelector
      renderButtonAsIcon
      labels={labels}
      value={selected}
      onChange={handleLabelChange}
    />
  );
}
