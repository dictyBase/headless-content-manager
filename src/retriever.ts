import {
  Do as TEDo,
  bind as TEbind,
  let as TElet,
  fold as TEfold,
} from "fp-ts/TaskEither"
import { of as Tof } from "fp-ts/Task"
import { pipe } from "fp-ts/function"
import { fetchStrainById, stockClient } from "./grpc"

const strainFetcher = (server: string, strainID: string) =>
  pipe(
    TEDo,
    TElet("client", () => stockClient(server)),
    TElet("fetch", ({ client }) => fetchStrainById(client)),
    TEbind("strain", ({ fetch }) => fetch(strainID)),
    TEfold(
      (error) => Tof(`error in fetching strain ${error.message}`),
      ({ strain }) => Tof(`got the strain ${strain.data?.attributes?.label}`),
    ),
  )

export { strainFetcher }
