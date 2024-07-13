"use client" // this registers <Editor> as a Client Component
import { BlockNoteView } from "@blocknote/ariakit"
// import "@blocknote/ariakit/style.css"
import "@blocknote/ariakit/style.css"
import "@blocknote/core/fonts/inter.css"
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  useCreateBlockNote,
} from "@blocknote/react"
import "./styles.css"

// Our <Editor> component we can reuse later
export default function Editor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    trailingBlock: false,
    // defaultStyles: false,

    domAttributes: {
      blockGroup: {
        class: "prose prose-stone max-w-none dark:prose-invert",
      },
    },
  })

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      data-theming-custom
      editor={editor}
      formattingToolbar={false}
      sideMenu={false}
      // slashMenu={false}
      spellCheck="false"
      theme="light"
    >
      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <BlockTypeSelect key="blockTypeSelect" />

            <FileCaptionButton key="fileCaptionButton" />
            <FileReplaceButton key="replaceFileButton" />

            <BasicTextStyleButton basicTextStyle="bold" key="boldStyleButton" />
            <BasicTextStyleButton basicTextStyle="italic" key="italicStyleButton" />
            <BasicTextStyleButton basicTextStyle="underline" key="underlineStyleButton" />
            <BasicTextStyleButton basicTextStyle="strike" key="strikeStyleButton" />
            {/* Extra button to toggle code styles */}
            <BasicTextStyleButton basicTextStyle="code" key="codeStyleButton" />

            <CreateLinkButton key="createLinkButton" />
          </FormattingToolbar>
        )}
      />
    </BlockNoteView>
  )
}
