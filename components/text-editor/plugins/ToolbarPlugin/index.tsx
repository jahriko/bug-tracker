/* eslint-disable import/no-extraneous-dependencies -- TODO: Remove this once we have a better way to import these */
import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isParentElementRTL } from '@lexical/selection';
import { $isTableNode } from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  $isEditorIsNestedEditor,
  mergeRegister,
} from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  type ElementFormatType,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  type NodeKey,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/catalyst/dropdown';
import { getSelectedNode } from '../../getSelectedNode';
import { useModal } from '../../hooks/use-modal';
import { sanitizeUrl } from '../../url';
import { InsertImageDialog } from '../ImagesPlugin';
import { InsertTableDialog } from '../TablePlugin';
import { PlusIcon } from '@heroicons/react/16/solid';

const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

const IS_APPLE: boolean =
  CAN_USE_DOM && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

function dropDownActiveClass(active: boolean) {
  if (active) {
    return 'active dropdown-item-active';
  }
  return '';
}

function Divider(): JSX.Element {
  return <div className="divider" />;
}

export function ToolbarPlugin({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: React.Dispatch<boolean>;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>('paragraph');
  const [rootType, setRootType] =
    useState<keyof typeof rootTypeToRootName>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );

  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [modal, showModal] = useModal();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [isImageCaption, setIsImageCaption] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement();
        setIsImageCaption(
          Boolean(
            rootElement?.parentElement?.classList.contains(
              'image-caption-container',
            ),
          ),
        );
      } else {
        setIsImageCaption(false);
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language = element.getLanguage()!;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        // eslint-disable-next-line no-nested-ternary -- TODO: Remove this once we have a better way to handle the element format
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() ?? 'left',
      );
    }
  }, [activeEditor, editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl('https://');
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl('https://'),
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  const canViewerSeeInsertDropdown = !isImageCaption;
  const canViewerSeeInsertCodeButton = !isImageCaption;

  return (
    <div className="flex items-center space-x-2 bg-zinc-100 rounded-t-lg p-1">
      {blockType === 'code' ? (
        <Dropdown>
          <DropdownButton
            aria-label="Select language"
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={!isEditable}
          >
            {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
              return (
                <DropdownItem
                  key={value}
                  className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                    value === codeLanguage ? 'bg-gray-100 text-gray-900' : ''
                  }`}
                  onClick={() => onCodeLanguageSelect(value)}
                >
                  <span>{name}</span>
                </DropdownItem>
              );
            })}
          </DropdownButton>
        </Dropdown>
      ) : (
        <>
          <button
            className={`p-2 rounded-md ${
              isBold ? 'bg-gray-200' : 'hover:bg-gray-200'
            }`}
            disabled={!isEditable}
            title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
            type="button"
            aria-label={`Format text as bold. Shortcut: ${
              IS_APPLE ? '⌘B' : 'Ctrl+B'
            }`}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}
          >
            <i className="fas fa-bold" />
          </button>
          <button
            className={`p-2 rounded-md ${
              isItalic ? 'bg-gray-200' : 'hover:bg-gray-200'
            }`}
            disabled={!isEditable}
            title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
            type="button"
            aria-label={`Format text as italics. Shortcut: ${
              IS_APPLE ? '⌘I' : 'Ctrl+I'
            }`}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}
          >
            <i className="fas fa-italic" />
          </button>
          <button
            className={`p-2 rounded-md ${
              isUnderline ? 'bg-gray-200' : 'hover:bg-gray-200'
            }`}
            disabled={!isEditable}
            title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
            type="button"
            aria-label={`Format text to underlined. Shortcut: ${
              IS_APPLE ? '⌘U' : 'Ctrl+U'
            }`}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}
          >
            <i className="fas fa-underline" />
          </button>
          {canViewerSeeInsertCodeButton ? (
            <button
              aria-label="Insert code block"
              className={`p-2 rounded-md ${
                isCode ? 'bg-gray-200' : 'hover:bg-gray-200'
              }`}
              disabled={!isEditable}
              title="Insert code block"
              type="button"
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
              }}
            >
              <i className="fas fa-code" />
            </button>
          ) : null}
          <button
            aria-label="Insert link"
            className={`p-2 rounded-md ${
              isLink ? 'bg-gray-200' : 'hover:bg-gray-200'
            }`}
            disabled={!isEditable}
            title="Insert link"
            type="button"
            onClick={insertLink}
          >
            <i className="fas fa-link" />
          </button>
          <Dropdown>
            <DropdownButton
              aria-label="Formatting options for additional text styles"
              className="p-2 rounded-md hover:bg-gray-200"
              disabled={!isEditable}
            >
              <i className="fas fa-ellipsis-h" />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem
                onClick={() => {
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    'strikethrough',
                  );
                }}
              >
                <i className="fas fa-strikethrough mr-2" />
                <DropdownLabel>Strikethrough</DropdownLabel>
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    'subscript',
                  );
                }}
              >
                <i className="fas fa-subscript mr-2" />
                <DropdownLabel>Subscript</DropdownLabel>
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  activeEditor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    'superscript',
                  );
                }}
              >
                <i className="fas fa-superscript mr-2" />
                <DropdownLabel>Superscript</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {canViewerSeeInsertDropdown ? (
            <>
              <div className="border-l border-gray-300 h-6 mx-2" />
              <Dropdown>
                <DropdownButton
                  aria-label="Insert specialized editor node"
                  plain
                  disabled={!isEditable}
                >
                  <PlusIcon />
                  Insert
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      showModal('Insert Image', (onClose) => (
                        <InsertImageDialog
                          activeEditor={activeEditor}
                          onClose={onClose}
                        />
                      ));
                    }}
                  >
                    <i className="fas fa-image mr-2" />
                    <DropdownLabel>Image</DropdownLabel>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      showModal('Insert Table', (onClose) => (
                        <InsertTableDialog
                          activeEditor={activeEditor}
                          onClose={onClose}
                        />
                      ));
                    }}
                  >
                    <i className="fas fa-table mr-2" />
                    <DropdownLabel>Table</DropdownLabel>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : null}
        </>
      )}
      {modal}
    </div>
  );
}
