"use client" // this registers <Editor> as a Client Component
import { BlockNoteView } from "@blocknote/ariakit"
import "@blocknote/ariakit/style.css"
import "@blocknote/core/fonts/inter.css"
import { useCreateBlockNote } from "@blocknote/react"
import "./styles.css"
// Our <Editor> component we can reuse later
export default function Editor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    dictionary: {
      placeholders: {
        default: "Enter description...",
        heading: "Heading",
        bulletListItem: "List",
        numberedListItem: "List",
        checkListItem: "List",
      },
    },
  })

  console.log(editor.document)
  //   editor.removeBlocks(["SideMenu"])

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
