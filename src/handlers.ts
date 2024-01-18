import { match, P } from "ts-pattern"
import type {
  ChildrenProperties,
  LeafElementProperties,
  ElementTypeProperties,
  blockTypeProperties,
} from "./types"

const newlineRgxp = new RegExp(/\n/)

const BLOCK_TYPES: blockTypeProperties = {
  divider: (document: Document) => document.createElement("hr"),
  div: (document: Document) => document.createElement("div"),
  h1: (document: Document) => document.createElement("h1"),
  h2: (document: Document) => document.createElement("h2"),
  h3: (document: Document) => document.createElement("h3"),
  h4: (document: Document) => document.createElement("h4"),
  paragraph: (document: Document) => document.createElement("p"),
  center: (document: Document) => document.createElement("p"),
  unorderedList: (document: Document) => document.createElement("ul"),
  orderedList: (document: Document) => document.createElement("ol"),
  listItem: (document: Document) => document.createElement("li"),
  image: (document: Document) => document.createElement("img"),
  link: (document: Document) => document.createElement("a"),
  br: (document: Document) => document.createElement("br"),
}

/**
 * Returns an element from the given document based on the provided node type.
 */
const elementFromType = (document: Document, nodeType: string) =>
  match(nodeType in BLOCK_TYPES)
    .with(true, () => BLOCK_TYPES[nodeType](document))
    .otherwise(() => null)

/**
 * This function processes a child node and inserts its content into an element.
 */
const processChildNode = (
  document: Document,
  node: ChildrenProperties,
  element: ElementTypeProperties,
) =>
  match(extractNodeContent(node))
    .with(P.not(P.nullish), (textContent) => {
      if (newlineRgxp.test(textContent)) {
        element.appendChild(document.createElement("br"))
      }
      element.appendChild(
        document.createTextNode(processTextContent(textContent)),
      )
    })
    .otherwise(() => {})

/**
 * Sets the href property of an HTMLAnchorElement using the text of the first
 * child of a LeafElementProperties node.
 *
 */
const anchorElement = (
  node: LeafElementProperties,
  element: HTMLAnchorElement,
) => {
  const content = node.children.at(0)?.text
  content && (element.href = content)
}

/**
 * Sets the src property of an HTMLImageElement to the URL specified in the node.
 */
const imageElement = (node: LeafElementProperties, element: HTMLImageElement) =>
  (element.src = node.url as string)

/**
 * Extracts the content of a node.
 */
const extractNodeContent = (node: ChildrenProperties) =>
  node.text ? node.text : null

const elementWithContent = (elem: ElementTypeProperties) =>
  elem.textContent ? elem : null

const processTextContent = (content: string) => content.replace(/\n/, "")

export {
  imageElement,
  anchorElement,
  elementFromType,
  processChildNode,
  elementWithContent,
}
