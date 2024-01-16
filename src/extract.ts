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
} from "./handlers"

const extractContent = async (
  file: string,
): Promise<Array<ElementProperties>> => {
  const fh = Bun.file(file)
  return await fh.json()
}

const curriedBlockToElements =
  (document: Document) => (node: blockProperties) =>
    match({
      nodeType: node.type,
      element: elementFromType(document, node.type),
      node,
    })
      .with({ nodeType: "divider" }, ({ element }) => element)
      .with({ nodeType: "image" }, ({ node, element }) => {
        imageElement(node as LeafElementProperties, element as HTMLImageElement)
        return element
      })
      .with({ nodeType: "link" }, ({ node, element }) => {
        anchorElement(
          node as LeafElementProperties,
          element as HTMLAnchorElement,
        )
        return element
      })
      .with({ element: P.not(P.nullish) }, ({ node, element }) => {
        allOtherElements(document, node, element)
        return element
      })
      .otherwise(({ element }) => element)

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
      .otherwise((childNode) =>
        processChildNode(childNode as ChildrenProperties, element),
      )
  })
}

export { extractContent, curriedBlockToElements }
