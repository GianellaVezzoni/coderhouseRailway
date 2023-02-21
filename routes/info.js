import express from "express";
import util from "util";
// import { fork } from "child_process";
import compression from "compression";
import parseArgs from "minimist";
export const args = parseArgs(process.argv.slice(2));
export const PORT = args.port || 8080;

const infoRoutes = express.Router();

infoRoutes.get("/info", compression(),  async (req, res) => {
  const memory = util.inspect(process.memoryUsage().rss);
  // Se probó comentando y descomentando el log para comprobar funcionamiento
  console.log(`<p>Argumentos:  ${args}</p><br />
  <p>Sist operativo: ${process.platform}</p><br />
  <p>Versión de node ${process.version}</p><br />
  <p>Memoria utilizada ${memory}</p><br />
  <p>Pid ${process.pid}</p><br />
  <p>Puerto ${PORT}</p><br />
  <p>Carpeta del proyecto  ${process.cwd()}</p><br />`)
  
  res.render("info", {
    arguments: process?.argv?.slice(2).length
      ? process?.argv?.slice(2)
      : "no se pasaron args",
    platformName: process.platform,
    nodeVersion: process.version,
    totalMemory: memory,
    execPath: process.execPath,
    pid: process.pid,
    projectFile: process.cwd(),
  });
});

infoRoutes.get("/info-no-logs", compression(),  async (req, res) => {
  const memory = util.inspect(process.memoryUsage().rss);
  res.render("info", {
    arguments: process?.argv?.slice(2).length
      ? process?.argv?.slice(2)
      : "no se pasaron args",
    platformName: process.platform,
    nodeVersion: process.version,
    totalMemory: memory,
    execPath: process.execPath,
    pid: process.pid,
    projectFile: process.cwd(),
  });
});

// Con el child process desactivado
infoRoutes.get("/randoms", (req, res) => {
  const cant = parseFloat(Object.keys(req.query)[0]) || 100000000;
    function calculateRandomNumbers(cant){
      const max = 1000;
      const min = 1;
      const numbers = [];
      for(let i = 0; i < cant; i++){
          let numberRandom = Math.floor((Math.random() * (max - min + 1)) + min);
          numbers.push(numberRandom);
      }
      return numbers.reduce((prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev), {})
    }
    res.send(calculateRandomNumbers(cant));
});

// Con el child process activado
// infoRoutes.get("/randoms", (req, res) => {
//   const cant = parseFloat(Object.keys(req.query)[0]);
//   const forkResult = fork("./utils/calculateRandomNumbers.js");
//   forkResult.on("message", (msg) => {
//     if (msg == "ready") {
//       forkResult.send(cant);
//     } else {
//       res.json(msg);
//     }
//   });
// });

export default infoRoutes;
