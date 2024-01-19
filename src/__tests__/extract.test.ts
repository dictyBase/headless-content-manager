import { expect, describe, beforeEach, afterEach, test } from "bun:test"
import { JSDOM, type DOMWindow } from "jsdom"
import { allOtherElements } from "../extract"

describe("allOtherElements", () => {
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
  test("appends proper elements to the parent", () => {
    const mockElement = document.createElement("div")
    const mockNode = {
      type: "div",
      children: [
        {
          text: "Hello",
          fontColor: "black",
          fontSize: "12px",
          fontFamily: "Arial",
          bold: true,
          italic: true,
        },
      ],
    }
    allOtherElements(document, mockNode, mockElement)
    expect(mockElement.childNodes.length).toBe(1)
    expect(mockElement.firstElementChild?.tagName).toBe("B")
    expect(mockElement.firstElementChild?.firstElementChild?.tagName).toBe("I")
    expect(mockElement.firstElementChild?.firstElementChild?.textContent).toBe(
      "Hello",
    )
  })
  test("appends all descendant elements to the parent", () => {
    const mockElement = document.createElement("h1")
    const mockNode = {
      type: "h1",
      children: [
        {
          type: "div",
          children: [
            {
              text: "Hello",
              fontColor: "black",
              fontSize: "12px",
              fontFamily: "Arial",
              bold: true,
              italic: true,
            },
          ],
        },
      ],
    }
    allOtherElements(document, mockNode, mockElement)
    expect(mockElement.childNodes.length).toBe(1)
    expect(mockElement.firstElementChild?.tagName).toBe("DIV")
    expect(mockElement.firstElementChild?.firstElementChild?.tagName).toBe("B")
    expect(
      mockElement.firstElementChild?.firstElementChild?.firstElementChild
        ?.tagName,
    ).toBe("I")
    expect(
      mockElement.firstElementChild?.firstElementChild?.firstElementChild
        ?.textContent,
    ).toBe("Hello")
  })
  test("appends all descendant elements with different texts to the parent", () => {
    const mockElement = document.createElement("h1")
    const mockNode = {
      type: "h1",
      children: [
        {
          type: "div",
          children: [
            {
              text: "Hello",
              fontColor: "black",
              fontSize: "12px",
              fontFamily: "Arial",
              bold: true,
              italic: true,
            },
            {
              text: "Hello bold",
              fontColor: "black",
              fontSize: "12px",
              fontFamily: "Arial",
              bold: true,
            },
          ],
        },
      ],
    }
    allOtherElements(document, mockNode, mockElement)
    expect(mockElement.childNodes.length).toBe(1)
    expect(mockElement.firstElementChild?.tagName).toBe("DIV")
    expect(mockElement.firstElementChild?.childNodes.length).toBe(2)
    expect(mockElement.firstElementChild?.firstElementChild?.tagName).toBe("B")
    expect(
      mockElement.firstElementChild?.firstElementChild?.firstElementChild
        ?.tagName,
    ).toBe("I")
    expect(mockElement.firstElementChild?.lastElementChild?.tagName).toBe("B")
    expect(mockElement.firstElementChild?.lastElementChild?.textContent).toBe(
      "Hello bold",
    )
  })
})
