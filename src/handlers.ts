import { match, P } from "ts-pattern"
import type {
  ChildrenProperties,
  LeafElementProperties,
  ImageElementProperties,
  ElementTypeProperties,
  blockTypeProperties,
  handleBoldAndItalicProperties,
} from "./types"

const newlineRgxp = new RegExp(/\n/)

const BLOCK_TYPES: blockTypeProperties = {
  divider: (document: Document) => document.createElement("hr"),
  div: (document: Document) => document.createElement("div"),
  lineSpacing: (document: Document) => document.createElement("div"),
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
  tableWrap: (document: Document) => document.createElement("table"),
  tableRow: (document: Document) => document.createElement("tr"),
  tableCell: (document: Document) => document.createElement("td"),
}

/**
 * Returns an element from the given document based on the provided node type.
 */
const elementFromType = (document: Document, nodeType: string) =>
  match(nodeType in BLOCK_TYPES)
    .with(true, () => BLOCK_TYPES[nodeType](document))
    .otherwise(() => null)

/**
 * Processes a child node by applying necessary formatting and appending it to the parent element.
 * If the child node's text content contains a newline, it appends a <br> element.
 * It calls `setBoldAndItalic` to apply bold and italic formatting if necessary
 * and `setFontProperties` to apply relevant font properties.
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
      setBoldAndItalic({ document, node, element, textContent })
      setFontProperties(node, element)
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
  const url = node.url
  content && (element.textContent = content)
  url && (element.href = url)
}

/**
 * Sets the src property of an HTMLImageElement to the URL specified in the node.
 */
const imageElement = (
  node: ImageElementProperties,
  element: HTMLImageElement,
) => {
  element.height = Number(node.height as string)
  element.width = Number(node.width as string)
  element.src = node.url as string
}

/**
 * Extracts the content of a node.
 */
const extractNodeContent = (node: ChildrenProperties) =>
  node.text ? node.text : null

const elementWithContent = (elem: ElementTypeProperties) =>
  elem.textContent ? elem : null

/**
 * Processes the text content by removing all newline characters.
 */
const processTextContent = (content: string) => content.replace(newlineRgxp, "")

/**
 * Applies bold and/or italic styling to a given text content based on the properties of a node.
 * The styling is applied by creating HTML `<b>` and `<i>` elements and appending them to the
 * specified element within the document.
 */
const setBoldAndItalic = ({
  document,
  element,
  node,
  textContent,
}: handleBoldAndItalicProperties) =>
  match({
    italic: node.italic,
    bold: node.bold,
    document,
    element,
    textContent,
  })
    .with(
      { italic: true, bold: true },
      ({ document, element, textContent }) => {
        const bold = document.createElement("b")
        const italic = document.createElement("i")
        const txtNode = document.createTextNode(processTextContent(textContent))
        italic.appendChild(txtNode)
        bold.appendChild(italic)
        element.appendChild(bold)
      },
    )
    .with({ italic: true }, ({ document, element, textContent }) => {
      const italic = document.createElement("i")
      const txtNode = document.createTextNode(processTextContent(textContent))
      italic.appendChild(txtNode)
      element.appendChild(italic)
    })
    .with({ bold: true }, ({ document, element, textContent }) => {
      const bold = document.createElement("b")
      const txtNode = document.createTextNode(processTextContent(textContent))
      bold.appendChild(txtNode)
      element.appendChild(bold)
    })
    .otherwise(({ textContent, document, element }) => {
      element.appendChild(
        document.createTextNode(processTextContent(textContent)),
      )
    })

/**
 * Sets the font properties of an HTML element based on the given node attributes.
 */
const setFontProperties = (
  node: ChildrenProperties,
  element: ElementTypeProperties,
) => {
  element.style.fontSize = node.fontSize
  element.style.color = node.fontColor
  element.style.fontFamily = node.fontFamily
}

export {
  imageElement,
  anchorElement,
  elementFromType,
  processChildNode,
  elementWithContent,
  setFontProperties,
  setBoldAndItalic,
  processTextContent,
  BLOCK_TYPES,
}
