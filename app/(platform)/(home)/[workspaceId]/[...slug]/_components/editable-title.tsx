'use client';

import { useState } from 'react';
import { BorderlessTextarea } from '@/components/catalyst/borderless-textarea';
import { BorderlessInput } from './borderless-input';

export function EditableTitle({ initialTitle, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (title !== initialTitle) {
      onSave(title);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div onClick={handleClick}>
      <BorderlessTextarea
        className="dark:text-white [&>*]:w-full [&>*]:text-xl [&>*]:font-semibold"
        readOnly={!isEditing}
        resizable={false}
        value={title}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
    </div>
  );
}
