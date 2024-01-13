import { match } from "ts-pattern"

type ChildrenProperties = {
  text: string
  fontColor: string
  fontSize: string
  fontFamily: string
  bold?: boolean
  italic?: boolean
  link?: boolean
}

type LeafElementProperties = {
  type: string
  children: Array<ChildrenProperties>
  url?: string
}

type ElementProperties = {
  type: string
  children: Array<LeafElementProperties>
  align?: string
}

type ElementTypeProperties =
  | HTMLHeadingElement
  | HTMLParagraphElement
  | HTMLUListElement
  | HTMLOListElement
  | HTMLLIElement
  | HTMLDivElement
  | HTMLHRElement
  | HTMLImageElement
  | HTMLAnchorElement

type blockFn = (document: Document) => ElementTypeProperties

type blockTypeProperties = Record<string, blockFn>

type blockProperties = LeafElementProperties | ElementProperties

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

const curriedBlockToElements =
  (document: Document) => (node: blockProperties) => {
    const nodeType = node.type
    if (!(nodeType in BLOCK_TYPES)) {
      return
    }
    const element = BLOCK_TYPES[nodeType](document)
    match(nodeType)
      .with("divider", () => element)
      .with("image", () =>
        imageElement(
          node as LeafElementProperties,
          element as HTMLImageElement,
        ),
      )
      .with("link", () =>
        anchorElement(
          node as LeafElementProperties,
          element as HTMLAnchorElement,
        ),
      )
      .otherwise(() => {
        node.children.forEach((childNode) => {
          if ("type" in childNode) {
            const nextElement = curriedBlockToElements(document)(
              childNode as blockProperties,
            )
            if (nextElement) {
              element.appendChild(nextElement)
            }
            return element
          }
          const textContent = extractNodeContent(
            childNode as ChildrenProperties,
          )
          if (textContent) {
            if (element.textContent) {
              element.insertAdjacentHTML(
                "afterbegin",
                element.textContent.concat(" ").concat(textContent),
              )
            } else {
              element.insertAdjacentHTML("afterbegin", textContent)
            }
          }
        })
        return element
      })
  }

const anchorElement = (
  node: LeafElementProperties,
  element: HTMLAnchorElement,
) => {
  element.href = node.children[0].text
  return element
}

const anchorElement = (
  node: LeafElementProperties,
  element: HTMLAnchorElement,
) => (element.href = node.children[0].text)

const imageElement = (node: LeafElementProperties, element: HTMLImageElement) =>
  (element.src = node.url as string)

const extractNodeContent = (node: ChildrenProperties) => {
  if (!node.text) {
    return
  }
  const content = node.text
  return content
}

export { extractContent, curriedBlockToElements }
