import autocannon from "autocannon";
import { PassThrough } from "stream";

function executeBenchMarks(url) {
  const bufferArray = [];
  const outputPassTh = new PassThrough();

  const autocannonInstance = autocannon({
    url,
    connections: 100,
    duration: 20,
  });

  autocannon.track(autocannonInstance, { outputPassTh });

  outputPassTh.on("data", (data) => bufferArray.push(data));
  autocannonInstance.on("done", () => {
    process.stdout.write(Buffer.concat(bufferArray));
  });
}

executeBenchMarks("http://localhost:8080/info");
// executeBenchMarks("http://localhost:8080/info-no-logs");
