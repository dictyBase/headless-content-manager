import { Command } from "commander"
import {
  slateToLexical as legacySlateToLexical,
  slateToHtml as legacySlateToHtml,
} from "./src/legacyConverter"
import { slateToHtml, slateToLexical } from "./src/converter"

const program = new Command()

program
  .name("convert")
  .description("CLI to convert slatejs json to lexical format")
  .version("1.0.0")


program
  .command("slate-to-html")
  .description("convert slatejs format to html")
  .requiredOption("-f, --file <input>", "input file in slatejs format")
  .action((options) => {
    console.log(slateToHtml(options.file))
  })

program
  .command("slate-to-lexical")
  .description("convert slatejs to lexical format")
  .requiredOption("-f, --file <input>", "input file in slatejs format")
  .action((options) => {
    console.log(slateToLexical(options.file))
  })

program
  .command("legacy-slate-to-html")
  .description("convert legacy slatejs format to html")
  .requiredOption("-f, --file <input>", "input file in legacy slatejs format")
  .action((options) => {
    console.log(legacySlateToHtml(options.file))
  })

program
  .command("legacy-slate-to-lexical")
  .description("convert legacy slatejs to lexical format")
  .requiredOption("-f, --file <input>", "input file in legacy slatejs format")
  .action((options) => {
    console.log(legacySlateToLexical(options.file))
  })

program.parse()
