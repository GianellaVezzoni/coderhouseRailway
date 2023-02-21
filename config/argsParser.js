import parseYargs from "yargs/yargs";

const yargs = parseYargs(process.argv.slice(2));

export const { modo, puerto, debug, _ } = yargs
  .boolean("debug")
  .alias({
    m: "modo",
    p: "puerto",
    d: "debug",
  })
  .default({
    modo: "prod",
    puerto: 8080,
    debug: false,
  }).argv;
