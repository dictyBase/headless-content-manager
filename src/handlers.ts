import { match, P } from "ts-pattern"
import type {
  ChildrenProperties,
  LeafElementProperties,
  ElementTypeProperties,
  blockTypeProperties,
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

const elementFromType = (document: Document, nodeType: string) =>
  match(nodeType in BLOCK_TYPES)
    .with(true, () => BLOCK_TYPES[nodeType](document))
    .otherwise(() => null)



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

export {
  imageElement,
  anchorElement,
  elementFromType,
  processChildNode,
}
