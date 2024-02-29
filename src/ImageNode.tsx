/* eslint-disable class-methods-use-this */
import {
  DecoratorNode,
  type EditorConfig,
  type Spread,
  type SerializedLexicalNode,
} from "lexical"

type SerializedImageNode = Spread<
  {
    source: string
    width: number
    height: number
    alt?: string | undefined
    type: "image"
  },
  SerializedLexicalNode
>

type ImageNodeConstructorProperties = {
  source: string
  width: number
  height: number
  alt?: string | undefined
  key?: string
}

class ImageNode extends DecoratorNode<any> {
  __source

  __alt

  __height

  __width

  static override getType() {
    return "image"
  }

  static override clone(node: ImageNode) {
    const {
      __source: source,
      __alt: alt,
      __key: key,
      __width: width,
      __height: height,
    } = node
    return new ImageNode({
      source,
      alt,
      key,
      width,
      height,
    })
  }

  static override importJSON({
    source,
    alt,
    width,
    height,
  }: SerializedImageNode): ImageNode {
    return new ImageNode({
      source,
      alt,
      width,
      height,
    })
  }

  constructor({
    source,
    width,
    height,
    alt,
    key,
  }: ImageNodeConstructorProperties) {
    super(key)
    this.__source = source
    this.__height = height
    this.__width = width
    this.__alt = alt
  }

  static importDOM() {
    const conversionFunction = (image: HTMLImageElement) => {
      return {
        node: new ImageNode({ source: image.src, width: image.width, height: image.height, alt: image.alt})
      }
    }
    return {
      "img": (node: HTMLImageElement) => ({ conversion: conversionFunction, priority: 0}), 
    }
  }

  override createDOM(config: EditorConfig) {
    const div = document.createElement("div")
    const { theme } = config
    const className = theme.image
    if (className) {
      div.className = className
    }
    return div
  }

  override updateDOM() {
    return false
  }

  override exportJSON(): SerializedImageNode {
    return {
      type: "image",
      source: this.__source,
      width: this.__width,
      height: this.__height,
      alt: this.__alt,
      version: 1,
    }
  }

  override decorate() {
    return null
  }
}

export { type SerializedImageNode, ImageNode }
