import { expect, describe, test } from "bun:test"
import { convertToTargetStructure } from "../convertToTargetStructure"

describe("convertToTargetStructure", () => {
  test("root has exactly one child and it is a flex-layout node", () => {
    const input = {
      root: {
        type: "root",
        children: [
          {
            type: "heading",
            tag: "h1",
            children: [{ type: "text", text: "Title" }],
          },
          {
            type: "flex-layout",
            children: [
              { type: "paragraph", children: [{ type: "text", text: "A" }] },
            ],
          },
          {
            type: "list",
            children: [
              {
                type: "listitem",
                children: [{ type: "text", text: "Item" }],
              },
            ],
          },
        ],
      },
    }

    const output = convertToTargetStructure(input)

    expect(output.root.children).toHaveLength(1)
    expect(output.root.children[0].type).toBe("flex-layout")
  })

  test("every non-root node is a descendant of the flex-layout node", () => {
    const input = {
      root: {
        type: "root",
        children: [
          {
            type: "heading",
            tag: "h1",
            children: [{ type: "text", text: "A" }],
          },
          {
            type: "flex-layout",
            children: [
              { type: "paragraph", children: [{ type: "text", text: "B" }] },
              {
                type: "flex-layout",
                children: [
                  {
                    type: "list",
                    children: [
                      {
                        type: "listitem",
                        children: [{ type: "text", text: "C" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { type: "paragraph", children: [{ type: "text", text: "D" }] },
        ],
      },
    }

    const output = convertToTargetStructure(input)

    const flexLayout = output.root.children[0]
    expect(flexLayout.type).toBe("flex-layout")

    const visited = new Set<any>()
    const findOrphans = (node: any, withinFlex: boolean) => {
      visited.add(node)
      if (node === output.root) return
      if (node !== flexLayout && !withinFlex) {
        expect(node.type).toBe("flex-layout")
      }
      for (const child of node.children ?? []) {
        findOrphans(child, withinFlex || node === flexLayout)
      }
    }

    findOrphans(output.root, false)
  })

  test("wraps all root children in a single flex-layout", () => {
    const input = {
      root: {
        type: "root",
        children: [
          {
            type: "heading",
            tag: "h1",
            children: [{ type: "text", text: "Title" }],
          },
          {
            type: "paragraph",
            children: [{ type: "text", text: "Body" }],
          },
        ],
      },
    }

    const output = convertToTargetStructure(input)

    expect(output.root.type).toBe("root")
    expect(output.root.children).toHaveLength(1)
    expect(output.root.children[0].type).toBe("flex-layout")
    expect(output.root.children[0].children).toHaveLength(2)
    expect(output.root.children[0].children.map((c) => c.type)).toEqual([
      "heading",
      "paragraph",
    ])
  })

  test("flattens nested flex-layout containers", () => {
    const input = {
      root: {
        type: "root",
        children: [
          {
            type: "flex-layout",
            children: [
              {
                type: "flex-layout",
                children: [
                  {
                    type: "paragraph",
                    children: [{ type: "text", text: "Nested" }],
                  },
                ],
              },
              {
                type: "paragraph",
                children: [{ type: "text", text: "Sibling" }],
              },
            ],
          },
        ],
      },
    }

    const output = convertToTargetStructure(input)
    const flexContainer = output.root.children[0]

    expect(flexContainer.children).toHaveLength(2)
    expect(flexContainer.children.map((c) => c.type)).toEqual([
      "paragraph",
      "paragraph",
    ])
    expect(flexContainer.children[0].children[0].text).toBe("Nested")
    expect(flexContainer.children[1].children[0].text).toBe("Sibling")
  })

  test("splits a paragraph that contains nested block children", () => {
    const input = {
      root: {
        type: "root",
        children: [
          {
            type: "flex-layout",
            children: [
              {
                type: "paragraph",
                children: [
                  { type: "text", text: "Intro text" },
                  {
                    type: "heading",
                    tag: "h3",
                    children: [{ type: "text", text: "Section" }],
                  },
                  {
                    type: "list",
                    children: [
                      {
                        type: "listitem",
                        children: [{ type: "text", text: "Item" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    }

    const output = convertToTargetStructure(input)
    const flexContainer = output.root.children[0]

    expect(flexContainer.children).toHaveLength(3)
    expect(flexContainer.children.map((c) => c.type)).toEqual([
      "paragraph",
      "heading",
      "list",
    ])
    expect(flexContainer.children[0].children[0].text).toBe("Intro text")
    expect(flexContainer.children[1].children[0].text).toBe("Section")
  })

  test("drops empty paragraphs and headings", () => {
    const input = {
      root: {
        type: "root",
        children: [
          {
            type: "flex-layout",
            children: [
              { type: "paragraph", children: [] },
              {
                type: "paragraph",
                children: [{ type: "text", text: "   " }],
              },
              {
                type: "heading",
                tag: "h2",
                children: [],
              },
              {
                type: "paragraph",
                children: [{ type: "text", text: "Real content" }],
              },
            ],
          },
        ],
      },
    }

    const output = convertToTargetStructure(input)
    const flexContainer = output.root.children[0]

    expect(flexContainer.children).toHaveLength(1)
    expect(flexContainer.children[0].children[0].text).toBe("Real content")
  })

  test("maps download-link to link and linebreak to text with newline", () => {
    const input = {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "download-link",
                url: "https://example.com/file.docx",
                children: [{ type: "text", text: "Download" }],
              },
              { type: "linebreak", version: 1 },
              { type: "text", text: "after" },
            ],
          },
        ],
      },
    }

    const output = convertToTargetStructure(input)
    const paragraph = output.root.children[0].children[0]

    expect(paragraph.type).toBe("paragraph")
    expect(paragraph.children).toHaveLength(3)
    expect(paragraph.children[0].type).toBe("link")
    expect(paragraph.children[0].url).toBe("https://example.com/file.docx")
    expect(paragraph.children[0].children[0].text).toBe("Download")
    expect(paragraph.children[1].type).toBe("text")
    expect(paragraph.children[1].text).toBe("\n")
    expect(paragraph.children[2].text).toBe("after")
  })

  test("preserves links inside listitems", () => {
    const input = {
      root: {
        type: "root",
        children: [
          {
            type: "list",
            children: [
              {
                type: "listitem",
                children: [
                  {
                    type: "download-link",
                    url: "https://example.com/a.pdf",
                    children: [{ type: "text", text: "PDF A" }],
                  },
                ],
              },
              {
                type: "listitem",
                children: [
                  { type: "text", text: "Label: " },
                  {
                    type: "link",
                    url: "https://example.com/b",
                    children: [{ type: "text", text: "Link B" }],
                  },
                ],
              },
            ],
          },
        ],
      },
    }

    const output = convertToTargetStructure(input)
    const list = output.root.children[0].children[0]

    expect(list.type).toBe("list")
    expect(list.children).toHaveLength(2)

    const [first, second] = list.children
    expect(first.type).toBe("listitem")
    expect(first.children[0].type).toBe("link")
    expect(first.children[0].url).toBe("https://example.com/a.pdf")
    expect(first.children[0].children[0].text).toBe("PDF A")

    expect(second.children[0].type).toBe("text")
    expect(second.children[0].text).toBe("Label: ")
    expect(second.children[1].type).toBe("link")
    expect(second.children[1].children[0].text).toBe("Link B")
  })

  test("produces only the target node hierarchy", () => {
    const input = {
      root: {
        type: "root",
        children: [
          {
            type: "flex-layout",
            children: [
              {
                type: "paragraph",
                children: [
                  { type: "text", text: "Text" },
                  {
                    type: "link",
                    url: "https://example.com",
                    children: [{ type: "text", text: "Site" }],
                  },
                ],
              },
              {
                type: "heading",
                tag: "h1",
                children: [{ type: "text", text: "Heading" }],
              },
              {
                type: "quote",
                children: [{ type: "text", text: "Quote" }],
              },
            ],
          },
        ],
      },
    }

    const output = convertToTargetStructure(input)

    const allowed = new Set([
      "root",
      "flex-layout",
      "paragraph",
      "heading",
      "list",
      "listitem",
      "image-node",
      "link",
      "quote",
      "text",
    ])

    const edges = new Set<string>()
    const walk = (node: any, parentType?: string) => {
      expect(allowed.has(node.type)).toBe(true)
      if (parentType) edges.add(`${parentType}->${node.type}`)
      for (const child of node.children ?? []) walk(child, node.type)
    }
    walk(output.root)

    // No forbidden edges should appear
    expect(edges.has("root->flex-layout")).toBe(true)
    expect(edges.has("paragraph->heading")).toBe(false)
    expect(edges.has("flex-layout->flex-layout")).toBe(false)
  })

  test("preserves heading tag attribute", () => {
    const input = {
      root: {
        type: "root",
        children: [
          {
            type: "heading",
            tag: "h1",
            children: [{ type: "text", text: "Title" }],
          },
        ],
      },
    }

    const output = convertToTargetStructure(input)
    const heading = output.root.children[0].children[0]

    expect(heading.type).toBe("heading")
    expect(heading.tag).toBe("h1")
    expect(heading.children).toHaveLength(1)
    expect(heading.children[0].text).toBe("Title")
  })
})
