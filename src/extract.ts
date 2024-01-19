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
 * Converts a block node to corresponding DOM elements using curried function
 * patterns.
 *
 * This function takes a blockProperties object and applies different
 * transformation logic based on the type of block node. It uses pattern
 * matching to apply the appropriate transformations, returning the resulting
 * DOM element.
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
        return element
        // return elementWithContent(element as ElementTypeProperties)
      })
      // If the nodeType is "link", call the "anchorElement" function with the
      // "node" and "element" as arguments, and return the "element".
      .with({ nodeType: "link" }, ({ node, element }) => {
        anchorElement(
          node as LeafElementProperties,
          element as HTMLAnchorElement,
        )
        return element
        // return elementWithContent(element as ElementTypeProperties)
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
 * Processes a node recursively and, if applicable, appends the converted
 * element to the current element.
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
 * Iterates over all children of a given node and processes each child node.
 * Nodes with a 'type' property are processed recursively, while others are handled directly.
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

export { extractContent, curriedBlockToElements, allOtherElements }
