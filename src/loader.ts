import {
  tryCatch,
  map as TEmap,
  Do as TEDo,
  bind as TEbind,
  let as TElet,
  ApplicativeSeq,
} from "fp-ts/TaskEither"
import {
  map as Amap,
  sequence as Asequence,
  Do as ADo,
  let as Alet,
  bind as Abind,
} from "fp-ts/Array"
import { toError } from "fp-ts/Either"
import { pipe } from "fp-ts/function"
import {
  type IterateJsonFilesAndSaveProperties,
  type PersistLexicalProperties,
} from "./types"
import { parseFileName, slateToLexical } from "./converter"
import { join, parse } from "path"
import { contentClient, loadContent } from "./grpc"
import { readdir } from "node:fs/promises"

const persistLexical = ({
  jsonFilePath,
  loadContentFn,
}: PersistLexicalProperties) =>
  pipe(
    TEDo,
    TElet("parsedFile", () => parse(jsonFilePath)),
    TElet("fileinfo", parseFileName),
    TElet("createdBy", () => "pfey@northwestern.edu"),
    TEbind("content", () =>
      tryCatch(() => slateToLexical(jsonFilePath), toError),
    ),
    TEbind("output", ({ content, createdBy, fileinfo: { name, namespace } }) =>
      loadContentFn({
        name,
        namespace,
        createdBy,
        content,
      }),
    ),
    TEmap(({ output }) => output),
  )

const iterateJsonFilesAndSave = ({
  files,
  folder,
  loadContentFn,
}: IterateJsonFilesAndSaveProperties) => {
  return pipe(
    ADo,
    Alet("inputFiles", () => files),
    Alet("folder", () => folder),
    Alet("loadContentFn", () => loadContentFn),
    Abind("jsonFile", ({ inputFiles }) =>
      inputFiles.filter((f) => f.endsWith(".json")),
    ),
    Alet("jsonFilePath", ({ folder, jsonFile }) => join(folder, jsonFile)),
    Amap(persistLexical),
    Asequence(ApplicativeSeq),
  )
}

const loadLexicalContent = (folder: string, server: string) =>
  pipe(
    TEDo,
    TElet("server", () => server),
    TElet("folder", () => folder),
    TElet("client", ({ server }) => contentClient(server)),
    TElet("loadContentFn", ({ client }) => loadContent(client)),
    TEbind("files", ({ folder }) => tryCatch(() => readdir(folder), toError)),
    TEbind("contents", iterateJsonFilesAndSave),
  )

export { loadLexicalContent }
