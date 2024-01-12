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

type blockTypeProperties = Record<string, blockFn>

type blockProperties = LeafElementProperties | ElementProperties

const BLOCK_TYPES: blockTypeProperties = {
  div: (document: Document) => document.createElement("div"),
  h1: (document: Document) => document.createElement("h1"),
  h2: (document: Document) => document.createElement("h2"),
  h3: (document: Document) => document.createElement("h3"),
  h4: (document: Document) => document.createElement("h4"),
  paragraph: (document: Document) => document.createElement("p"),
  unorderedList: (document: Document) => document.createElement("ul"),
  orderedList: (document: Document) => document.createElement("ol"),
  listItem: (document: Document) => document.createElement("li"),
}

const extractContent = async (
  file: string,
): Promise<Array<ElementProperties>> => {
  const fh = Bun.file(file)
  return await fh.json()
}

const curriedBlockToElements =
  (document: Document) => (node: blockProperties) => {
    if (!BLOCK_TYPES[node.type]) {
      console.warn(node.type, " not found")
      return
    }
    const element = BLOCK_TYPES[node.type](document)
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
