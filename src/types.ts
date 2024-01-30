import { type TaskEither } from "fp-ts/TaskEither"
import { Content } from "./es/dictybase/content/content_pb"

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

type IterateJsonFilesAndSaveProperties = {
  files: Array<string>
  folder: string
  loadContentFn: LoadContentFnProperties
}

type PersistContentProperties = {
  createdBy: string
  content: string
  fileinfo: {
    name: string
    namespace: string
  }
}

type LoadContentProperties = {
  name: string
  namespace: string
  createdBy: string
  content: string
}

type LoadContentFnProperties = (
  props: LoadContentProperties,
) => TaskEither<Error, Content>

type PersistLexicalProperties = {
  jsonFilePath: string
  loadContentFn: LoadContentFnProperties
}

export type {
  ChildrenProperties,
  LeafElementProperties,
  ElementTypeProperties,
  blockProperties,
  blockTypeProperties,
  ElementProperties,
  handleBoldAndItalicProperties,
  IterateJsonFilesAndSaveProperties,
  PersistContentProperties,
  LoadContentProperties,
  LoadContentFnProperties,
  PersistLexicalProperties,
}
