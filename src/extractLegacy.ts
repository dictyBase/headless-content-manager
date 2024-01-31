import { match } from "ts-pattern"

type marksProperties = {
  object: string
  type: string
  data?: {
    href: string
  }
}

type blockFn = (
  document: Document,
) =>
  | HTMLHeadingElement
  | HTMLParagraphElement
  | HTMLUListElement
  | HTMLOListElement
  | HTMLLIElement

type blockTypeProperties = Record<string, blockFn>

type leafProperties = {
  object: string
  text: string
  marks: Array<marksProperties>
}

type textObjectProperties = {
  object: string
  leaves: Array<leafProperties>
}

type blockProperties = {
  object: string
  type: string
  data: any
  nodes: Array<textObjectProperties | blockProperties | undefined>
}

type contentProperties = {
  object: string
  document: {
    object: string
    data: any
    nodes: Array<blockProperties>
  }
}

const serializeContent = (content: any) => JSON.stringify(content, null, 2)

const BLOCK_TYPES: blockTypeProperties = {
  h1: (document: Document) => document.createElement("h1"),
  h2: (document: Document) => document.createElement("h2"),
  h3: (document: Document) => document.createElement("h3"),
  h4: (document: Document) => document.createElement("h4"),
  paragraph: (document: Document) => document.createElement("p"),
  "unordered-list": (document: Document) => document.createElement("ul"),
  "ordered-list": (document: Document) => document.createElement("ol"),
  "list-item": (document: Document) => document.createElement("li"),
}

const extractContent = async (file: string): Promise<contentProperties> => {
  const fh = Bun.file(file)
  const dataObj = await fh.json()
  return JSON.parse(dataObj.data.attributes.content)
}

const extractBlockNodes = (
  content: contentProperties,
): Array<blockProperties> => content.document.nodes

const curriedBlockNodesToElement =
  (document: Document) => (node: blockProperties) => {
    if (!BLOCK_TYPES[node.type]) {
      console.warn(node.type, " not found")
      return
    }
    const elementFn = BLOCK_TYPES[node.type]
    if (node.nodes.length == 0) {
      return
    }
    const element = elementFn(document)
    if (node.type === "unordered-list" || node.type === "ordered-list") {
      node.nodes.forEach((n) => {
        if (n) {
          const liElement = curriedBlockNodesToElement(document)(
            n as blockProperties,
          )
          element.appendChild(liElement as HTMLLIElement)
        }
      })
      return element
    }
    const texts = node.nodes
      .map((n) => extractNodeContent(n as textObjectProperties))
      .join(" ")
    element.insertAdjacentHTML("afterbegin", texts)
    return element
  }

const extractNodeContent = (node: textObjectProperties) => {
  if (node.object != "text") {
    return
  }
  if (node.leaves[0].object != "leaf") {
    return
  }
  const content = node.leaves[0].text
  return content == "\n"
    ? "<br/>"
    : addMarksToContent(content, node.leaves[0].marks)
}

const addMarksToContent = (content: string, marks: Array<marksProperties>) => {
  marks.forEach((m) => {
    match(m.type)
      .with("bold", () => {
        content = `<b>${content}</b>`
      })
      .with("link", () => {
        content = `<a href=${m.data?.href}>${content}</a>`
      })
      .otherwise(() => {})
  })
  return content
}

export {
  extractContent,
  curriedBlockNodesToElement,
  extractBlockNodes,
  serializeContent,
}
