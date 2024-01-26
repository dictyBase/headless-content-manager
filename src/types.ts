type ChildrenProperties = {
  text: string | null
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

type blockProperties = LeafElementProperties | ElementProperties

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
  | HTMLBRElement

type blockFn = (document: Document) => ElementTypeProperties

type blockTypeProperties = Record<string, blockFn>

type handleBoldAndItalicProperties = {
  document: Document
  node: ChildrenProperties
  element: ElementTypeProperties
  textContent: string
}

type convertJsonFilesToLexicalProperties = {
  files: Array<string>
  folder: string
  server: string
}

type persistContentProperties = {
  createdBy: string
  content: string
  fileinfo: {
    name: string
    namespace: string
  }
}

export type {
  ChildrenProperties,
  LeafElementProperties,
  ElementTypeProperties,
  blockProperties,
  blockTypeProperties,
  ElementProperties,
  handleBoldAndItalicProperties,
  convertJsonFilesToLexicalProperties,
  persistContentProperties,
}
