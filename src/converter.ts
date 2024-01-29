import { pipe } from "fp-ts/function"
import { JSDOM } from "jsdom"
import { map as Amap, filter as Afilter } from "fp-ts/Array"
import { extractContent, curriedBlockToElements } from "./extract"
import { syncEditor, editorInstance } from "./editor"
import { type ElementTypeProperties } from "./types"
import { readdir } from "node:fs/promises"
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

const convertSlateToLexicalAndWrite =
  (output: string) => async (jsonFilePath: string) => {
    const json = await slateToLexical(jsonFilePath)
    const parsedFile = parse(jsonFilePath)
    await Bun.write(join(output, `${parsedFile.name}.json`), json)
  }

const parseFileName = ({ parsedFile }: { parsedFile: ParsedPath }) => {
  const [namespace, name] = parsedFile.name.split("-")
  return { name, namespace }
}

const convertSlateToLexicalAndPersist = (server: string) => {
  const client = contentClient(server)
  const curriedLoadContent = loadContent(client)
  return (jsonFilePath: string) =>
    pipe(
      TEDo,
      TElet("parsedFile", () => parse(jsonFilePath)),
      TElet("fileinfo", parseFileName),
      TElet("createdBy", () => "pfey@northwestern.edu"),
      TEbind("content", () =>
        tryCatch(() => slateToLexical(jsonFilePath), toError),
      ),
      TEbind(
        "output",
        ({ content, createdBy, fileinfo: { name, namespace } }) =>
          curriedLoadContent({
            name,
            namespace,
            createdBy,
            content,
          }),
      ),
      TEmap(({ output }) => output),
    )
}
const batchSlateToLexical = async (input: string, output: string) => {
  const curriedConverter = convertSlateToLexicalAndWrite(output)
  pipe(
    await readdir(input),
    Afilter((inputFile) => inputFile.endsWith(".json")),
    Amap((jsonFileName) => join(input, jsonFileName)),
    Amap(curriedConverter),
  )
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

const allHtmls = async (input: string) =>
  pipe(
    await readdir(input),
    Afilter((file) => file.endsWith(".json")),
    Amap(async (file) => {
      const inputFile = join(input, file)
      const html = await slateToHtml(inputFile)
      return { html, file }
    }),
  )

const batchSlateToHtml = async (input: string, output: string) => {
  const allContents = await Promise.all(await allHtmls(input))
  allContents.map(async ({ html, file }) => {
    const parsedFile = parse(file)
    await Bun.write(join(output, `${parsedFile.name}.html`), html)
  })
}

export { slateToLexical, slateToHtml, batchSlateToHtml, batchSlateToLexical }
