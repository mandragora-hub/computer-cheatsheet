#!/bin/node

const util = require("util");
const exec = util.promisify(require("child_process").exec);
const fs = require("fs");
const { Worker } = require("worker_threads");
const normalize = require("./lib/normalize");
const chunk = require("lodash/chunk");

async function getDirectories() {
  const { stdout, stderr } = await exec("echo $PATH | tr ':' '\n'");
  stderr && console.error("stderr:", stderr);
  const directories = stdout.split("\n");
  const availableDirectories = [];
  for (const directory of directories) {
    fs.existsSync(directory) && availableDirectories.push(directory);
  }
  return availableDirectories;
}

async function getBinaries(directories) {
  const binaries = [];
  for (const directory of directories) {
    const { stdout, stderr } = await exec(
      `ls ${directory} | grep -v '/' | grep . | sort | sort -u`
    );
    stderr && console.error("stderr:", stderr);
    const cmd = stdout.split("\n");
    binaries.push(...cmd);
    // const availableDirectories = [];
    // for (const directory of directories) {
    //   fs.existsSync(directory) && availableDirectories.push(directory);
    // }
  }

  return normalize(binaries.sort());
}

getDirectories().then(async (directories) => {
  console.log("directories:", directories);
  const binaries = await getBinaries(directories);
  for (binariesChunk of chunk(binaries, 100)) {
    console.log(binariesChunk)
    const worker = new Worker(__dirname + "/worker/information-worker.js", {
      workerData: {
        binaries: binariesChunk,
      },
    });

    worker.on("message", (msg) => {
      console.log(msg);
    });
  }
});
