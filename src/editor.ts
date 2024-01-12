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

const syncEditor = (editor: LexicalEditor) => (document: Document) => {
  editor.update(
    () => {
      const nodes = $generateNodesFromDOM(editor, document)
      const validNodesToInsert = nodes.map((node) => {
        if (node.getType() === "text") {
          const paragraphNode = $createParagraphNode()
          paragraphNode.append(node)
          return paragraphNode
        }
        return node
      })
      $getRoot().select()
      const selection = $getSelection()
      selection?.insertNodes(validNodesToInsert)
    },
    {
      discrete: true,
    },
  )
}

const editorInstance = () =>
  createHeadlessEditor({
    onError: console.error,
    nodes: [LinkNode, ListItemNode, ListNode, HeadingNode],
  })

const generateHtml = (content: string) => `<!DOCTYPE html><p>${content}</p>`

export { editorInstance, generateHtml, syncEditor }
