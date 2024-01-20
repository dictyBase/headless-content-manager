import { pipe } from "fp-ts/function"
import { JSDOM } from "jsdom"
import { map as Amap } from "fp-ts/Array"
import { extractContent, curriedBlockToElements } from "./extract"
import { syncEditor, editorInstance } from "./editor"
import { type ElementTypeProperties } from "./types"
import { readdir, writeFile } from "node:fs/promises"
import { join, parse } from "path"

const curriedAddBlockElement =
  (document: Document) => (elem: ElementTypeProperties | null) =>
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
  syncEditor(document, contEditor)
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

const allHtmls = async (folder: string) => {
  const allFiles = await readdir(folder)
  return allFiles
    .filter((file) => file.endsWith(".json"))
    .map(async (file) => {
      const inputFile = join(folder, file)
      const html = await slateToHtml(inputFile)
      return { html, file }
    })
}

const batchSlateToHtml = async (input: string, output: string) => {
  const allContents = await Promise.all(await allHtmls(input))
  allContents.map(async ({ html, file }) => {
    const parsedFile = parse(file)
    await writeFile(join(output, `${parsedFile.name}.html`), html)
  })
}

export { slateToLexical, slateToHtml, batchSlateToHtml }
