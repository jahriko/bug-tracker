"use client"

import { useState } from "react"
import { BorderlessInput } from "./borderless-input"
import { BorderlessTextarea } from "@/components/catalyst/borderless-textarea"

export const EditableTitle = ({ initialTitle, onSave }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (title !== initialTitle) {
      onSave(title)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur()
    }
  }

  return (
    <div onClick={handleClick}>
      <BorderlessTextarea
        className="dark:text-white [&>*]:w-full [&>*]:text-xl [&>*]:font-semibold"
        onBlur={handleBlur}
		resizable={false}
        onChange={(e) => {
          setTitle(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        readOnly={!isEditing}
        value={title}
      />
    </div>
  )
}
