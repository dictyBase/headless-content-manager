type LexicalNode = {
  type: string;
  children?: Array<LexicalNode>;
  [key: string]: unknown;
};

type LexicalRoot = {
  root: LexicalNode;
};

/** Node types considered "inline" (can be children of paragraph/heading/listitem). */
const INLINE_TYPES = new Set(["text", "link", "download-link", "linebreak"]);

/** Node types that only exist to wrap other blocks and should be flattened. */
const CONTAINER_TYPES = new Set(["flex-layout"]);

function isInline(node: LexicalNode): boolean {
  return INLINE_TYPES.has(node.type);
}

function isContainer(node: LexicalNode): boolean {
  return CONTAINER_TYPES.has(node.type);
}

function hasTextualContent(children: LexicalNode[] | undefined): boolean {
  if (!children || children.length === 0) return false;
  return children.some((c) => {
    if (c.type === "text") return (c.text as string)?.trim().length > 0;
    if (c.type === "linebreak") return false; // linebreak alone has no real content
    return true; // links, etc. count as content
  });
}

/**
 * Deep-clone a lexical node keeping only the keys we care about.
 */
function cloneNode(node: LexicalNode, extra?: Record<string, unknown>): LexicalNode {
  const out: LexicalNode = { type: node.type, ...extra };
  for (const k of Object.keys(node)) {
    if (k === "children" || k === "type") continue;
    if (extra && k in extra) continue;
    out[k] = node[k];
  }
  return out;
}

/**
 * Map inline child nodes to their target types (e.g. download-link → link,
 * linebreak → text with "\n"), recursing into nested inline nodes.
 */
function mapInline(node: LexicalNode): LexicalNode {
  if (node.type === "download-link") {
    return {
      ...cloneNode(node, { type: "link" }),
      children: (node.children ?? []).map(mapInline),
    };
  }
  if (node.type === "linebreak") {
    return cloneNode(node, { type: "text", text: "\n" });
  }
  if (node.children) {
    return { ...node, children: node.children.map(mapInline) };
  }
  return node;
}

// ---- recursive block flattening ----

/**
 * Recursively extracts block-level nodes from a tree, flattening container nodes
 * and splitting paragraphs that contain nested blocks.
 *
 * Returns an array of block nodes ready to be placed directly under flex-container.
 */
function extractBlocks(nodes: LexicalNode[]): LexicalNode[] {
  const result: LexicalNode[] = [];

  for (const node of nodes) {
    if (!node) continue;

    // Flatten containers
    if (isContainer(node)) {
      result.push(...extractBlocks(node.children ?? []));
      continue;
    }

    // Paragraph with block children → split
    if (node.type === "paragraph") {
      const children = node.children ?? [];
      const inlineChildren = children.filter(isInline);
      const blockChildren = children.filter((c) => !isInline(c));

      if (blockChildren.length > 0) {
        // Emit inline part as paragraph (if not empty)
        if (hasTextualContent(inlineChildren)) {
          result.push({
            ...cloneNode(node),
            type: "paragraph",
            children: inlineChildren.map(mapInline),
          });
        }
        // Recurse into the nested blocks
        result.push(...extractBlocks(blockChildren));
        continue;
      }

      // Pure inline paragraph — skip if empty
      if (!hasTextualContent(children)) continue;
      result.push({
        ...cloneNode(node),
        type: "paragraph",
        children: children.map(mapInline),
      });
      continue;
    }

    // Heading — skip if empty, otherwise keep with inline children
    if (node.type === "heading") {
      const children = (node.children ?? []).filter(isInline).map(mapInline);
      if (!hasTextualContent(children)) continue;
      result.push({ ...cloneNode(node), type: "heading", children });
      continue;
    }

    // List — process listitems
    if (node.type === "list") {
      const items = (node.children ?? [])
        .filter((c) => c.type === "listitem")
        .map((li) => ({
          ...cloneNode(li),
          type: "listitem",
          children: (li.children ?? [])
            .filter((c) => isInline(c) || c.type === "paragraph")
            .flatMap((c) => {
              if (c.type === "paragraph") {
                return (c.children ?? []).filter(isInline).map(mapInline);
              }
              return [mapInline(c)];
            }),
        }))
        .filter((li) => hasTextualContent(li.children));

      if (items.length > 0) {
        result.push({ ...cloneNode(node), type: "list", children: items });
      }
      continue;
    }

    // Quote
    if (node.type === "quote") {
      const children = (node.children ?? []).filter(isInline).map(mapInline);
      if (!hasTextualContent(children)) continue;
      result.push({ ...cloneNode(node), type: "quote", children });
      continue;
    }

    // Any other block type (image-node, etc.) — keep as-is
    if (!hasTextualContent(node.children)) continue;
    result.push(node);
  }

  return result;
}

/**
 * Converts a Lexical editor state JSON into the target structure defined in
 * target.md.
 *
 * Target hierarchy:
 *   Root → Flex Container → [paragraph, image-node, list, Quote, heading]
 *   paragraph → Text, Link
 *   Link → Text
 *   list → listitem → Text
 *   Quote → Text
 *   heading → Text
 *
 * @param root  A lexical document with a `root` property (the parsed "content" value).
 * @returns     A new lexical document conforming to the target structure.
 */
export function convertToTargetStructure(root: LexicalRoot): LexicalRoot {
  const blocks = extractBlocks(root.root.children ?? []);

  return {
    root: {
      type: "root",
      direction: null,
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "flex-container",
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
          children: blocks,
        },
      ],
    },
  };
}

