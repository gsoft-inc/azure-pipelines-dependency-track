import * as tl from "azure-pipelines-task-lib/task"
import * as fs from 'fs'
import * as path from 'path'

import DTrackClient from './dtrackClient.js'
import DTrackManager from './dtrackManager.js'
import {localize} from './localization.js'

function loadFile(path, errorKey) {
  try {
    return fs.readFileSync(path);
  }
  catch (err) {
    throw new Error(localize(errorKey, err));
  }
}

const run = async () => {
  tl.setResourcePath(path.join(__dirname, 'task.json'));

  const bomFilePath = tl.getPathInput('bomFilePath', true, true);
  const dtrackProjId = tl.getInput('dtrackProjId', true);
  const dtrackAPIKey = tl.getInput('dtrackAPIKey', true);
  const dtrackURI = tl.getInput('dtrackURI', true);
  const caFilePath = tl.getPathInput('caFilePath', false, true);

  if (!tl.stats(bomFilePath).isFile()) {
    throw new Error(localize('FileNotFound', bomFilePath));
  }

  let caFile;
  if (tl.stats(caFilePath).isFile() ) {
    console.log(localize('ReadingCA', caFilePath));
    caFile = loadFile(caFilePath, 'UnableToReadCA');
  }

  const client = new DTrackClient(dtrackURI, dtrackAPIKey, caFile);
  const dtrackManager = new DTrackManager(client, dtrackProjId);

  console.log(localize('ReadingBom', bomFilePath));
  const bom = loadFile(bomFilePath, 'UnableToReadBom');

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