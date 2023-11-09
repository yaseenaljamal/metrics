import { expect, t } from "@engine/utils/testing.ts"
import { command } from "@engine/utils/deno/command.ts"
import { Logger } from "@engine/utils/log.ts"
import { DevNull } from "@engine/utils/log_test.ts"

const stdio = new DevNull()
const log = new Logger(import.meta, { level: Logger.channels.trace, tags: { foo: "bar" }, stdio })

// TODO(@lowlighter): Use `{ permissions: { run: ["deno"] } }` when https://github.com/denoland/deno/issues/21123 fixed

Deno.test(t(import.meta, "`command()` can execute commands"), async () => {
  await expect(command("deno --version")).to.be.eventually.containSubset({ success: true, code: 0 })
})

Deno.test(t(import.meta, "`command()` returns stdio content instead if asked"), async () => {
  await expect(command("deno --version", { return: "stdout" })).to.eventually.include("deno")
})

Deno.test(t(import.meta, "`command()` returns stdio content instead if asked"), async () => {
  stdio.flush()
  await expect(command("deno --version", { log })).to.be.fulfilled
  expect(stdio.messages).to.not.be.empty
})