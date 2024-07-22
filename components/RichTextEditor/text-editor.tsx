"use client"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { TRANSFORMERS } from "@lexical/markdown"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"

import { $generateHtmlFromNodes } from "@lexical/html"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { useLocalStorage } from "@uidotdev/usehooks"
import { useEffect, useState } from "react"
import theme from "./editor-theme"
import AutoLinkPluginForEmailAndUrl from "./plugins/AutoLinkPlugin"
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin"
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin"

function Placeholder() {
  return (
    <div className="pointer-events-none absolute top-0 inline-block overflow-hidden text-ellipsis text-sm text-gray-600 dark:text-gray-100">
      Enter a description...
    </div>
  )
}

const editorConfig = {
  namespace: "Editor",
  theme,
  onError(error: any) {
    throw error
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
  ],
}

export default function Editor() {
  const [editorState, setEditorState] = useState<string>()
  const [, saveEditorState] = useLocalStorage("text", "")

  function onChange(editorState: any, editor: any, selection: any) {
    const editorStateJSON = editorState.toJSON()
    // console.log("Editor state changed!", JSON.stringify(editorStateJSON));
    // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
    setEditorState(JSON.stringify(editorStateJSON))
  }

  function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const htmlString = $generateHtmlFromNodes(editor, null)
          console.log(htmlString)
        })
      })
    }, [editor])

    return null
  }

  function onSave() {
    saveEditorState(editorState || "")
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative">
        <RichTextPlugin
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable className="relative min-h-[100px] resize-none border-none font-medium outline-0 dark:prose-invert focus:outline-none focus:ring-0" />
          }
          placeholder={<Placeholder />}
        />
        <HistoryPlugin />
        {/* <AutoFocusPlugin /> */}
        <CodeHighlightPlugin />
        <ListPlugin />
        <LinkPlugin />
        <AutoLinkPluginForEmailAndUrl />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <OnChangePlugin onChange={onChange} />
        {/* <MyCustomAutoFocusPlugin /> */}
      </div>
    </LexicalComposer>
  )
}
