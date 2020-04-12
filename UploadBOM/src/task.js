import * as tl from "azure-pipelines-task-lib/task"
import * as fs from 'fs'
import * as path from 'path'

import DTrackClient from './dtrackClient.js'
import DTrackManager from './dtrackManager.js'
import {localize} from './localization.js'

function loadBom(path) {
  try {
    return fs.readFileSync(path);
  }
  catch (err) {
    throw new Error(localize('UnableToReadBom', err));
  }
}

const run = async () => {
  tl.setResourcePath(path.join(__dirname, 'task.json'));

  const bomFilePath = tl.getPathInput('bomFilePath', true, true);
  const dtrackProjId = tl.getInput('dtrackProjId', true);
  const dtrackAPIKey = tl.getInput('dtrackAPIKey', true);
  const dtrackURI = tl.getInput('dtrackURI', true);

  if (!tl.stats(bomFilePath).isFile()) {
    throw new Error(localize('FileNotFound', bomFilePath));
  }

  const client = new DTrackClient(dtrackURI, dtrackAPIKey);
  const dtrackManager = new DTrackManager(client, dtrackProjId);

  console.log(localize('ReadingBom', bomFilePath));
  const bom = loadBom(bomFilePath);

  console.log(localize('BOMUploadStarting', dtrackURI));
  const token = await dtrackManager.uploadBomAsync(bom);
  console.log(localize('BOMUploadSucceed', token));
};

run().then(
  () => {
    console.log(localize('TaskSucceed'));
    process.exit(0);
  },
  err => {
    console.error(localize('TaskFailed', err));
    tl.setResult(tl.TaskResult.Failed, err.message);
    process.exit(1);
  }
);