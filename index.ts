import { Command, Option } from "commander"
import {
  slateToLexical as legacySlateToLexical,
  slateToHtml as legacySlateToHtml,
} from "./src/legacyConverter"
import {
  slateToHtml,
  slateToLexical,
  batchSlateToHtml,
  batchSlateToLexical,
} from "./src/converter"
import { strainFetcher } from "./src/retriever"
import { fetchAndSaveByNamespace } from "./src/graphql"

const program = new Command()

program
  .name("convert")
  .description("CLI to convert slatejs json to lexical format")
  .version("1.0.0")

program
  .command("slate-to-html")
  .description("convert slatejs format to html")
  .requiredOption("-f, --file <input>", "input file in slatejs format")
  .action(async (options) => {
    console.log(await slateToHtml(options.file))
  })

program
  .command("batch-slate-to-html")
  .description("convert a folder of slatejs format files to html")
  .requiredOption(
    "-i, --input <input>",
    "input folder with slatejs format files",
  )
  .requiredOption(
    "-o, --output <output>",
    "output folder where html files will be written",
  )
  .action(async (options) => {
    await batchSlateToHtml(options.input, options.output)
  })

program
  .command("slate-to-lexical")
  .description("convert slatejs to lexical format")
  .requiredOption("-f, --file <input>", "input file in slatejs format")
  .action(async (options) => {
    console.log(await slateToLexical(options.file))
  })

program
  .command("batch-slate-to-lexical")
  .description("convert a folder of slatejs files to lexical format")
  .requiredOption(
    "-i, --input <input>",
    "input folder with slatejs format files",
  )
  .requiredOption(
    "-o, --output <output>",
    "output folder where lexical files will be written",
  )
  .action(async (options) => {
    await batchSlateToLexical(options.input, options.output)
  })

program
  .command("legacy-slate-to-html")
  .description("convert legacy slatejs format to html")
  .requiredOption("-f, --file <input>", "input file in legacy slatejs format")
  .action(async (options) => {
    console.log(await legacySlateToHtml(options.file))
  })

program
  .command("legacy-slate-to-lexical")
  .description("convert legacy slatejs to lexical format")
  .requiredOption("-f, --file <input>", "input file in legacy slatejs format")
  .action(async (options) => {
    console.log(await legacySlateToLexical(options.file))
  })

program
  .command("strain-info")
  .description("retrieve strain information from stock grpc service")
  .requiredOption("-i, --id <identifier>", "strain identifier or DBS id")
  .addOption(
    new Option("-a, --host <address>", "host address of stock grpc service")
      .default("stock-api")
      .env("STOCK_API_SERVICE_HOST"),
  )
  .addOption(
    new Option("-p, --port <port>", "port of stock grpc service").env(
      "STOCK_API_SERVICE_PORT",
    ),
  )
  .action(async (options) => {
    try {
      const output = await strainFetcher(
        `http://${options.host}:${options.port}`,
        options.id,
      )()
      console.log(output)
    } catch (error) {
      console.log(error)
    }
  })

program
  .command("fetch-by-namespace")
  .description(
    "fetch all content by namespace from GraphQL and save to input dir",
  )
  .requiredOption("-n, --namespace <namespace>", "content namespace")
  .addOption(
    new Option("-g, --graphql <url>", "GraphQL endpoint URL")
      .default("https://graphql.dictybase.dev/graphql")
      .env("GRAPHQL_ENDPOINT"),
  )
  .addOption(
    new Option("-o, --output <dir>", "output directory").default(
      "src/data/input",
    ),
  )
  .action(async (options) => {
    try {
      const items = await fetchAndSaveByNamespace(
        options.graphql,
        options.namespace,
        options.output,
      )
      console.log(`Saved ${items.length} content items to ${options.output}`)
    } catch (error) {
      console.error(error)
    }
  })

await program.parseAsync()
