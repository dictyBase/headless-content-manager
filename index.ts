import { Command } from "commander"
import {
  slateToLexical as legacySlateToLexical,
  slateToHtml as legacySlateToHtml,
} from "./src/legacyConverter"
import { slateToHtml, slateToLexical, batchSlateToHtml } from "./src/converter"

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

await program.parseAsync()
