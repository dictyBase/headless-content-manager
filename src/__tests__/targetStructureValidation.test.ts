import { expect, describe, test } from "bun:test"
import { readdir, readFile } from "node:fs/promises"
import { join } from "path"

type LexicalNode = {
  type: string
  children?: LexicalNode[]
  [key: string]: unknown
}

type LexicalRoot = {
  root: LexicalNode
}

const ALLOWED_TYPES = new Set([
  "root",
  "flex-layout",
  "paragraph",
  "heading",
  "list",
  "listitem",
  "image",
  "link",
  "quote",
  "text",
  "table",
  "tablecell",
  "tablerow",
])

const BLOCK_TYPES = new Set([
  "paragraph",
  "heading",
  "list",
  "image",
  "quote",
  "table",
])

const INLINE_TYPES = new Set(["text", "link"])

const validParentFor = (childType: string, parentType: string) => {
  switch (parentType) {
    case "root":
      return childType === "flex-layout"
    case "flex-layout":
      return BLOCK_TYPES.has(childType)
    case "paragraph":
    case "quote":
    case "heading":
      return INLINE_TYPES.has(childType)
    case "list":
      return childType === "listitem"
    case "listitem":
    case "link":
      return INLINE_TYPES.has(childType)
    case "download-link":
      return INLINE_TYPES.has(childType)
    case "text":
    case "image":
      return false // leaf nodes
    case "table":
      return childType === "tablerow"
    case "tablerow":
      return childType === "tablecell"
    case "tablecell":
      return BLOCK_TYPES.has(childType)
    default:
      return false
  }
}

const validateStructure = (root: LexicalNode, fileName: string) => {
  const errors: string[] = []

  const walk = (node: LexicalNode, parentType?: string) => {
    if (!ALLOWED_TYPES.has(node.type)) {
      errors.push(`${fileName}: unknown type "${node.type}"`)
    }

    if (parentType && !validParentFor(node.type, parentType)) {
      errors.push(`${fileName}: "${parentType}" cannot contain "${node.type}"`)
    }

    for (const child of node.children ?? []) {
      walk(child, node.type)
    }
  }

  walk(root)

  expect(errors).toEqual([])
}

const outputDir = join(import.meta.dirname, "..", "data", "output")

describe("output files match target structure", async () => {
  const files = (await readdir(outputDir)).filter((f) => f.endsWith(".json"))

  for (const file of files) {
    test(file, async () => {
      const raw = await readFile(join(outputDir, file))
      const json = JSON.parse(raw.toString()) as LexicalRoot
      expect(json.root).toBeDefined()
      expect(json.root.type).toBe("root")
      expect(json.root.children).toHaveLength(1)
      expect(json.root.children![0].type).toBe("flex-layout")
      validateStructure(json.root, file)
    })
  }
})

