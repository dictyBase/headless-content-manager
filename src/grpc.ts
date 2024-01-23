import { createPromiseClient, type PromiseClient } from "@connectrpc/connect"
import { createGrpcTransport } from "@connectrpc/connect-node"
import { ContentService } from "./es/dictybase/content/content_connect"
import { tryCatch } from "fp-ts/TaskEither"
import { toError } from "fp-ts/Either"

type LoadContentProperties = {
  name: string
  namespace: string
  createdBy: string
  content: string
}

const contentClient = (url: string) => {
  const transport = createGrpcTransport({ baseUrl: url, httpVersion: "2" })
  return createPromiseClient(ContentService, transport)
}

const loadContent =
  (client: PromiseClient<typeof ContentService>) =>
  ({ name, namespace, createdBy, content }: LoadContentProperties) =>
    tryCatch(async () => {
      const persistedContent = await client.storeContent({
        data: {
          attributes: {
            name,
            namespace,
            createdBy,
            content,
            slug: `${name}-${namespace}`,
          },
        },
      })
      return persistedContent
    }, toError)

export { contentClient, loadContent }
