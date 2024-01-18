import { match, P } from "ts-pattern"
import type {
  ChildrenProperties,
  LeafElementProperties,
  ElementTypeProperties,
  blockProperties,
  ElementProperties,
} from "./types"

import {
  imageElement,
  anchorElement,
  elementFromType,
  processChildNode,
  elementWithContent,
} from "./handlers"

/**
 * Extracts content from a file.
 */
const extractContent = async (
  file: string,
): Promise<Array<ElementProperties>> => {
  const fh = Bun.file(file)
  return await fh.json()
}

/**
 * This function converts a block node into corresponding HTML elements based on its type.
 */
const curriedBlockToElements =
  (document: Document) => (node: blockProperties) =>
    // Use pattern matching on the "nodeType" property of the "node" object, along with other properties, to perform different actions based on the type of node.
    match({
      nodeType: node.type,
      element: elementFromType(document, node.type),
      node,
    })
      // If the nodeType is "divider", return the "element" directly.
      .with({ nodeType: "divider" }, ({ element }) => element)
      // If the nodeType is "image", call the "imageElement" function with the
      // "node" and "element" as arguments, and return the "element".
      .with({ nodeType: "image" }, ({ node, element }) => {
        imageElement(node as LeafElementProperties, element as HTMLImageElement)
        return elementWithContent(element as ElementTypeProperties)
      })
      // If the nodeType is "link", call the "anchorElement" function with the
      // "node" and "element" as arguments, and return the "element".
      .with({ nodeType: "link" }, ({ node, element }) => {
        anchorElement(
          node as LeafElementProperties,
          element as HTMLAnchorElement,
        )
        return elementWithContent(element as ElementTypeProperties)
      })
      // If the "element" is not null or undefined, call the "allOtherElements"
      // function with the "document", "node", and "element" as arguments,
      // and return the "element".
      .with({ element: P.not(P.nullish) }, ({ node, element }) => {
        allOtherElements(document, node, element)
        return elementWithContent(element)
      })
      // For any other case, return the "element" directly.
      .otherwise(({ element }) => element)

/**
 * Processes and appends child elements recursively to a given element.
 */
const processRecursiveChildNode = (
  document: Document,
  node: LeafElementProperties | ChildrenProperties,
  element: ElementTypeProperties,
) => {
  const nextElement = curriedBlockToElements(document)(node as blockProperties)
  match(nextElement)
    .with(P.not(P.nullish), (nextElement) => element.appendChild(nextElement))
    .otherwise(() => {})
}

/**
 * Extracts all other elements from a given node in the document.
 *
 * In this function, the `allOtherElements` receives three parameters:
 * `document`, `node`, and `element`. It uses the `forEach` method to iterate
 * over each child node in the `node.children` collection.
 * For each child node, it checks if the node has a property called "type"
 * using the `in` operator. If the property exists, it calls the
 * `processRecursiveChildNode` function passing the `document`, `childNode`,
 * and `element` as arguments. Otherwise, it assumes the node is a regular
 * child node and calls the `processChildNode` function passing the `childNode`
 * and `element` as arguments.
 */

const allOtherElements = (
  document: Document,
  node: blockProperties,
  element: ElementTypeProperties,
) => {
  node.children.forEach((childNode) => {
    match(childNode)
      .when(
        (childNode) => "type" in childNode,
        (childNode) => processRecursiveChildNode(document, childNode, element),
      )
      .otherwise((childNode) => {
        processChildNode(document, childNode as ChildrenProperties, element)
      })
  })
}

export { extractContent, curriedBlockToElements }
