import { pipe } from "fp-ts/function"
import { JSDOM } from "jsdom"
import { map as Amap } from "fp-ts/Array"
import { extractContent, curriedBlockToElements } from "./extract"
import { syncEditor, editorInstance } from "./editor"

type ElementProperties =
  | HTMLLIElement
  | HTMLHeadingElement
  | HTMLUListElement
  | HTMLParagraphElement
  | HTMLDivElement
  | undefined

const curriedAddBlockElement =
  (document: Document) => (elem: ElementProperties) =>
    elem && document.body.appendChild(elem)

const slateToLexical = async (input: string) => {
  const dom = new JSDOM(`<!DOCTYPE html><html></html>`)
  const document = dom.window.document
  const addBlockElement = curriedAddBlockElement(document)
  const blockNodesToElements = curriedBlockToElements(document)
  const contEditor = editorInstance()
  pipe(
    await extractContent(input),
    Amap(blockNodesToElements),
    Amap(addBlockElement),
  )
  syncEditor(contEditor)(document)
  return JSON.stringify(contEditor.getEditorState(), null, 2)
}

const slateToHtml = async (input: string) => {
  const dom = new JSDOM(`<!DOCTYPE html><html></html>`)
  const document = dom.window.document
  const addBlockElement = curriedAddBlockElement(document)
  const blockNodesToElements = curriedBlockToElements(document)
  pipe(
    await extractContent(input),
    Amap(blockNodesToElements),
    Amap(addBlockElement),
  )
  return dom.serialize()
}

export { slateToLexical, slateToHtml }
