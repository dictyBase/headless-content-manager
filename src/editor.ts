import {
  $getRoot,
  $getSelection,
  type LexicalEditor,
  $createParagraphNode,
} from "lexical"
import { $generateNodesFromDOM } from "@lexical/html"
import { createHeadlessEditor } from "@lexical/headless"
import { LinkNode } from "@lexical/link"
import { ListNode, ListItemNode } from "@lexical/list"
import { HeadingNode } from "@lexical/rich-text"

/**
 * Synchronizes the editor with the provided document.
 
   This function synchronizes the provided `editor` with a `document` by
   performing the following steps:
	1. Generate nodes from the DOM using the `editor` and `document`.
	2. Filter and transform the nodes if they are of type "text" by
	creating a paragraph node and appending the text node to it.
	3. Select the root element using `$getRoot()` and get the current
	selection using `$getSelection()`.
	4. Insert the valid nodes into the selection using `insertNodes()`.
	5. The synchronization is performed within an `editor.update()` call
	with the option `{ discrete: true }`.
 */
const syncEditor = (editor: LexicalEditor) => (document: Document) => {
  editor.update(
    () => {
      // Generate nodes from the DOM
      const nodes = $generateNodesFromDOM(editor, document)

      // Filter and transform nodes if they are of type "text"
      const validNodesToInsert = nodes.map((node) => {
        if (node.getType() === "text") {
          const paragraphNode = $createParagraphNode()
          paragraphNode.append(node)
          return paragraphNode
        }
        return node
      })

      // Select the root element and get the current selection
      $getRoot().select()
      const selection = $getSelection()

      // Insert the valid nodes into the selection
      selection?.insertNodes(validNodesToInsert)
    },
    {
      discrete: true,
    },
  )
}

/**
 * Creates an instance of the headless editor.
 */
const editorInstance = () =>
  createHeadlessEditor({
    onError: console.error,
    nodes: [LinkNode, ListItemNode, ListNode, HeadingNode],
  })

const generateHtml = (content: string) => `<!DOCTYPE html><p>${content}</p>`

export { editorInstance, generateHtml, syncEditor }
