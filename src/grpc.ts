import { createPromiseClient, type PromiseClient } from "@connectrpc/connect"
import { createGrpcTransport } from "@connectrpc/connect-node"
import { ContentService } from "./es/dictybase/content/content_connect"
import { StockService } from "./es/dictybase/stock/stock_connect"
import { tryCatch, tapIO } from "fp-ts/TaskEither"
import { toError } from "fp-ts/Either"
import * as Console from "fp-ts/Console"
import { type LoadContentProperties } from "./types"

const stockClient = (url: string) => {
  const transport = createGrpcTransport({ baseUrl: url, httpVersion: "2" })
  return createPromiseClient(StockService, transport)
}

const fetchStrainById =
  (client: PromiseClient<typeof StockService>) => (id: string) =>
    tryCatch(() => client.getStrain({ id }), toError)

const contentClient = (url: string) => {
  const transport = createGrpcTransport({ baseUrl: url, httpVersion: "2" })
  return createPromiseClient(ContentService, transport)
}

const loadContent =
  (client: PromiseClient<typeof ContentService>) =>
  ({ name, namespace, createdBy, content }: LoadContentProperties) =>
    tryCatch(
      () =>
        client.storeContent({
          data: {
            attributes: {
              name,
              namespace,
              createdBy,
              content,
              slug: `${name}-${namespace}`,
            },
          },
        }),
      toError,
    )

const errLogger = tapIO(Console.error)
const infoLogger = tapIO(Console.info)
const warnLogger = tapIO(Console.warn)

export {
  contentClient,
  loadContent,
  errLogger,
  infoLogger,
  warnLogger,
  stockClient,
  fetchStrainById,
}
