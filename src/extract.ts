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

type blockFn = (
  document: Document,
) =>
  | HTMLHeadingElement
  | HTMLParagraphElement
  | HTMLUListElement
  | HTMLOListElement
  | HTMLLIElement
  | HTMLDivElement
  | HTMLHRElement
  | HTMLImageElement
  | HTMLAnchorElement

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
    if (nodeType == "lineSpacing") {
      return
    }
    if (!BLOCK_TYPES[nodeType]) {
      console.log(node.type, " not found")
      return
    }
    let element = BLOCK_TYPES[nodeType](document)
    if (nodeType == "divider") {
      return element
    }
    if (nodeType == "image") {
      const newElement = element as HTMLImageElement
      newElement.src = (node as LeafElementProperties).url as string
      return newElement
    }
    const children = node.children
    if ("type" in children[0]) {
      node.children.forEach((n) => {
        if (n) {
          const nextElement = curriedBlockToElements(document)(
            n as blockProperties,
          )
          if (nextElement) {
            element.appendChild(nextElement)
          }
        }
      })
      return element
    }
    const texts = node.children
      .map((n) => extractNodeContent(n as ChildrenProperties))
      .join(" ")
    if (texts.length == 0) {
      return
    }
    element.insertAdjacentHTML("afterbegin", texts)
    return element
  }

const extractNodeContent = (node: ChildrenProperties) => {
  if (!node.text) {
    return
  }
  const content = node.text
  return content
}

export { extractContent, curriedBlockToElements }
