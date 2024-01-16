import { match, P } from "ts-pattern"
import type {
  ChildrenProperties,
  LeafElementProperties,
  ElementTypeProperties,
  blockProperties,
  blockTypeProperties,
  ElementProperties,
} from "./types"

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
}

const extractContent = async (
  file: string,
): Promise<Array<ElementProperties>> => {
  const fh = Bun.file(file)
  return await fh.json()
}

const elementFromType = (document: Document, nodeType: string) =>
  match(nodeType in BLOCK_TYPES)
    .with(true, () => BLOCK_TYPES[nodeType](document))
    .otherwise(() => null)

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

const processChildNode = (
  node: ChildrenProperties,
  element: ElementTypeProperties,
) =>
  match(extractNodeContent(node))
    .with(P.nullish, (textContent) =>
      element.insertAdjacentHTML("afterbegin", textContent),
    )
    .otherwise((textContent) =>
      element.insertAdjacentHTML(
        "afterbegin",
        `${element.textContent} ${textContent}`,
      ),
    )

const anchorElement = (
  node: LeafElementProperties,
  element: HTMLAnchorElement,
) => (element.href = node.children[0].text)

const imageElement = (node: LeafElementProperties, element: HTMLImageElement) =>
  (element.src = node.url as string)

const extractNodeContent = (node: ChildrenProperties) => node.text

export { extractContent, curriedBlockToElements }
