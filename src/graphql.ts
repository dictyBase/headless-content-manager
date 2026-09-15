import { writeFile } from "node:fs/promises"
import { join } from "path"

const LIST_BY_NAMESPACE_QUERY = `
query ListContentByNamespace($namespace: String!, $limit: Int) {
  listContentByNamespace(namespace: $namespace, limit: $limit) {
    id
    content
    name
    slug
    created_at
    updated_at
    created_by {
      id
      email
      first_name
      last_name
      __typename
    }
    updated_by {
      id
      email
      first_name
      last_name
      __typename
    }
    __typename
  }
}`

type ContentItem = {
  id: string
  content: string
  name: string
  slug: string
  created_at: string
  updated_at: string
  created_by: {
    id: string
    email: string
    first_name: string
    last_name: string
  } | null
  updated_by: {
    id: string
    email: string
    first_name: string
    last_name: string
  } | null
}

const fetchAndSaveByNamespace = async (
  endpoint: string,
  namespace: string,
  limit: number,
  outputDir: string,
) => {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: LIST_BY_NAMESPACE_QUERY,
      variables: { namespace, limit },
    }),
  })
  if (!res.ok) throw new Error(`GraphQL error: ${res.status} ${res.statusText}`)
  console.log(res)
  const json = await res.json()
  const items = json.data?.listContentByNamespace
  if (!items) throw new Error(`Unexpected response: ${JSON.stringify(json)}`)
  for (const item of items) {
    console.log(item)
    await writeFile(
      join(outputDir, `${item.slug}.json`),
      JSON.stringify(item, null, 2),
    )
  }
  return items
}

export { fetchAndSaveByNamespace }
export type { ContentItem }
