/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"
import { BlockNoteView } from "@blocknote/ariakit"
import "@blocknote/ariakit/style.css"
import { Block, BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core"
import "@blocknote/core/fonts/inter.css"
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  CreateLinkButton,
  DefaultReactSuggestionItem,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  SuggestionMenuController,
  SuggestionMenuProps,
  useCreateBlockNote,
} from "@blocknote/react"
import "./styles.css"

async function saveToDatabase(jsonBlocks: Block[]) {
  // Save contents to local storage. You might want to debounce this or replace
  // with a call to your API / database.
  console.log("Saved.")
  // localStorage.setItem("editorContent", JSON.stringify(jsonBlocks))
}

function CustomSlashMenu2(props: SuggestionMenuProps<DefaultReactSuggestionItem>) {
  return (
    <div className="slash-menu">
      {props.items.map((item, index) => (
        <div
          className={`slash-menu-item${props.selectedIndex === index ? "selected" : ""}`}
          key={index}
          onClick={() => {
            props.onItemClick?.(item)
          }}
        >
          {item.title}
        </div>
      ))}
    </div>
  )
}

export default function Editor() {
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,

      file: undefined as any,
      video: undefined as any,
      audio: undefined as any,
    },
  })
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    trailingBlock: false,
    schema,

    domAttributes: {
      blockGroup: {
        class: "prose prose-stone max-w-none dark:prose-invert",
      },
    },
  })

  return (
    <BlockNoteView
      data-theming-custom
      editor={editor}
      formattingToolbar={false}
      onChange={async () => {
        await saveToDatabase(editor.document)
      }}
      sideMenu={false}
      spellCheck="false"
      theme="light"
    >
      <SuggestionMenuController
        suggestionMenuComponent={CustomSlashMenu2}
        triggerCharacter="/"
      />
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
            <BasicTextStyleButton basicTextStyle="code" key="codeStyleButton" />

            <CreateLinkButton key="createLinkButton" />
          </FormattingToolbar>
        )}
      />
    </BlockNoteView>
  )
}
