import { expect, describe, beforeEach, afterEach, test } from "bun:test"
import { JSDOM, type DOMWindow } from "jsdom"
import { match } from "ts-pattern"
import {
  setFontProperties,
  setBoldAndItalic,
  processTextContent,
  elementFromType,
  BLOCK_TYPES,
  processChildNode,
} from "../handlers"

const blockTypesTestCases = Object.keys(BLOCK_TYPES).map((blockType) => {
  return {
    blockType: blockType,
    expectedTag: match(blockType)
      .with("paragraph", () => "p")
      .with("center", () => "p")
      .with("link", () => "a")
      .with("image", () => "img")
      .with("listItem", () => "li")
      .with("orderedList", () => "ol")
      .with("unorderedList", () => "ul")
      .with("divider", () => "hr")
      .otherwise((blockType) => blockType),
  }
})

describe("setFontProperties", () => {
  let document: Document
  let window: DOMWindow
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><html></html>`)
    window = dom.window
    document = window.document
  })
  afterEach(() => {
    // After each test, clean up and destroy the JSDOM instance
    window.close()
  })

  test("sets the font properties on an element correctly", () => {
    const element = document.createElement("p")
    const node = {
      text: "Sample text",
      fontColor: "blue",
      fontSize: "16px",
      fontFamily: "Arial",
    }

    // Act
    setFontProperties(node, element)

    // Assert
    expect(element.style.fontSize).toBe("16px")
    expect(element.style.color).toBe("blue")
    expect(element.style.fontFamily).toBe("Arial")
  })
})

describe("setBoldAndItalic", () => {
  let document: Document
  let window: DOMWindow
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><html></html>`)
    window = dom.window
    document = window.document
  })
  afterEach(() => {
    // After each test, clean up and destroy the JSDOM instance
    window.close()
  })
  test("should append bold and italic elements when needed", () => {
    const elementMock = document.createElement("div")
    const nodePropsMob = {
      text: "Test text",
      fontColor: "black",
      fontSize: "12px",
      fontFamily: "Arial",
      bold: true,
      italic: true,
    }
    setBoldAndItalic({
      document,
      element: elementMock,
      node: nodePropsMob,
      textContent: nodePropsMob.text,
    })
    // Checking for the existence of <b> and <i>
    const boldElement = elementMock.querySelector("b")
    const italicElement = boldElement?.querySelector("i")
    expect(boldElement).not.toBe(null)
    expect(boldElement?.children).toContain(italicElement)
    expect(italicElement).not.toBe(null)
    expect(italicElement?.textContent).toBe(nodePropsMob.text)
  })

  test("should append bold elements when needed", () => {
    const elementMock = document.createElement("div")
    const nodePropsMob = {
      text: "Test text",
      fontColor: "black",
      fontSize: "12px",
      fontFamily: "Arial",
      bold: true,
    }
    setBoldAndItalic({
      document,
      element: elementMock,
      node: nodePropsMob,
      textContent: nodePropsMob.text,
    })
    const boldElement = elementMock.querySelector("b")
    expect(boldElement).not.toBe(null)
    expect(boldElement?.textContent).toBe(nodePropsMob.text)
  })

  test("should append italic elements when needed", () => {
    const elementMock = document.createElement("div")
    const nodePropsMob = {
      text: "Test text",
      fontColor: "black",
      fontSize: "12px",
      fontFamily: "Arial",
      italic: true,
    }
    setBoldAndItalic({
      document,
      element: elementMock,
      node: nodePropsMob,
      textContent: nodePropsMob.text,
    })
    const italicElement = elementMock.querySelector("i")
    expect(italicElement).not.toBe(null)
    expect(italicElement?.textContent).toBe(nodePropsMob.text)
  })

  test("should append text without bold and italic elements", () => {
    const elementMock = document.createElement("div")
    const nodePropsMob = {
      text: "Test text",
      fontColor: "black",
      fontSize: "12px",
      fontFamily: "Arial",
    }
    setBoldAndItalic({
      document,
      element: elementMock,
      node: nodePropsMob,
      textContent: nodePropsMob.text,
    })
    expect(elementMock?.textContent).toBe(nodePropsMob.text)
  })
})

describe("processTextContent", () => {
  test("should remove the first newline character from the content", () => {
    const input = "This is a test string.\nIt has several\nnew lines."
    const expectedOutput = "This is a test string.It has several\nnew lines."
    expect(processTextContent(input)).toBe(expectedOutput)
  })

  test("should leave the content unchanged if there are no newlines", () => {
    const input = "This is a test string without new lines."
    const expectedOutput = "This is a test string without new lines."
    expect(processTextContent(input)).toBe(expectedOutput)
  })

  test("should return empty string if content is empty", () => {
    const input = ""
    const expectedOutput = ""
    expect(processTextContent(input)).toBe(expectedOutput)
  })
})

describe("elementFromType", () => {
  let document: Document
  let window: DOMWindow
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><html></html>`)
    window = dom.window
    document = window.document
  })
  afterEach(() => {
    // After each test, clean up and destroy the JSDOM instance
    window.close()
  })
  test("should return null for undefined block type", () => {
    const undefinedType = "nonexistent"
    const element = elementFromType(document, undefinedType)
    expect(element).toBeNull()
  })
  test.each(blockTypesTestCases)(
    `should correctly create elements for block type`,
    ({ blockType, expectedTag }) => {
      const element = elementFromType(document, blockType)
      expect(element).not.toBeNull()
      expect(element?.tagName.toLowerCase()).toBe(expectedTag)
    },
  )
})

describe("processChildNode", () => {
  let document: Document
  let window: DOMWindow
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><html></html>`)
    window = dom.window
    document = window.document
  })
  afterEach(() => {
    window.close()
  })
  test("should append a <br> when there's a newline in text content", () => {
    const node = {
      text: "\nTest text",
      fontColor: "black",
      fontSize: "12px",
      fontFamily: "Arial",
      bold: true,
      italic: true,
    }
    const parentElement = document.createElement("div")
    processChildNode(document, node, parentElement)
    expect(parentElement.firstElementChild?.tagName).toBe("BR")
  })

  test("should not append a <br> if there's no newline in text content", () => {
    const node = {
      text: "Test text",
      fontColor: "black",
      fontSize: "12px",
      fontFamily: "Arial",
      bold: true,
      italic: true,
    }
    const parentElement = document.createElement("div")
    processChildNode(document, node, parentElement)
    const childElement = document.querySelector("br")
    expect(childElement).toBe(null)
  })
})
