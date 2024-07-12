"use client" // this registers <Editor> as a Client Component
import { BlockNoteView } from "@blocknote/ariakit"
import "@blocknote/ariakit/style.css"
import "@blocknote/core/fonts/inter.css"
import { useCreateBlockNote } from "@blocknote/react"
import "./styles.css"
import { en } from "./RichTextEditor/locales/en"
// Our <Editor> component we can reuse later
export default function Editor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    dictionary: en,
  })

  console.log(editor.document)

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      data-theming-css-variables-demo
      editor={editor}
      sideMenu={false}
      slashMenu={false}
      theme="light"
    />
  )
}
