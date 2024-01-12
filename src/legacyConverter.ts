import { pipe } from "fp-ts/function"
import { JSDOM } from "jsdom"
import { map as Amap } from "fp-ts/Array"
import {
  extractContent,
  extractBlockNodes,
  curriedBlockNodesToElement,
} from "./extractLegacy"
import { syncEditor, editorInstance } from "./editor"

type ElementProperties =
  | HTMLLIElement
  | HTMLHeadingElement
  | HTMLUListElement
  | undefined

const curriedAddBlockElement =
  (document: Document) => (elem: ElementProperties) =>
    elem && document.body.appendChild(elem)

const slateToLexical = async (input: string) => {
  const dom = new JSDOM(`<!DOCTYPE html><html></html>`)
  const document = dom.window.document
  const addBlockElement = curriedAddBlockElement(document)
  const blockNodesToElement = curriedBlockNodesToElement(document)
  const contEditor = editorInstance()
  pipe(
    await extractContent(input),
    extractBlockNodes,
    Amap(blockNodesToElement),
    Amap(addBlockElement),
  )
  syncEditor(contEditor)(document)
  return JSON.stringify(contEditor.getEditorState(), null, 2)
}

const slateToHtml = async (input: string) => {
  const dom = new JSDOM(`<!DOCTYPE html><html></html>`)
  const document = dom.window.document
  const addBlockElement = curriedAddBlockElement(document)
  const blockNodesToElement = curriedBlockNodesToElement(document)
  pipe(
    await extractContent(input),
    extractBlockNodes,
    Amap(blockNodesToElement),
    Amap(addBlockElement),
  )
  return dom.serialize()
}

export { slateToLexical, slateToHtml }
