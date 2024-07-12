"use client" // this registers <Editor> as a Client Component
import { BlockNoteView } from "@blocknote/mantine"
// import "@blocknote/ariakit/style.css"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"
import { useCreateBlockNote } from "@blocknote/react"
import { en } from "./RichTextEditor/locales/en"
import "./styles.css"
// Our <Editor> component we can reuse later
export default function Editor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    // defaultStyles: false,
    dictionary: en,

    domAttributes: {
      inlineContent: {
        class: "!prose !prose-sm dark:prose-invert !max-w-none ",
      },
    },
  })

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      data-theming-css-variables-demo
      // className="max-w-[1500px]"
      editor={editor}
      sideMenu={false}
      slashMenu={false}
      theme="light"
    />
  )
}
