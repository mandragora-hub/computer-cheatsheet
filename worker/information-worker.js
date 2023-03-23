const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { parentPort, workerData } = require("worker_threads");
const { binaries } = workerData;

async function getInformation() {
  const information = new Map();
  for (const binary of binaries) {
    try {
      const { stdout, stderr } = await exec(`whatis ${binary}`);
      if (stderr) throw new Error("stderr:", stderr);
      stdout && information.set(binary, stdout);
    } catch (error) {
      console.error(error);
    }
  }

  parentPort.postMessage(information);
}

getInformation().finally(() => parentPort.close());
