import * as tl from "azure-pipelines-task-lib/task"
import * as fs from 'fs'
import * as path from 'path'

import DTrackClient from './dtrackClient.js'
import DTrackManager from './dtrackManager.js'
import {localize} from './localization.js'
import ThresholdExpert from "./thresholdExpert.js"

function loadFile(path, errorKey) {
  if (!tl.stats(path).isFile()) {
    throw new Error(localize('FileNotFound', path));
  }

  try {
    return fs.readFileSync(path);
  }
  catch (err) {
    throw new Error(localize(errorKey, err));
  }
}

async function validateThresholdsAsync(token, thresholdAction, thresholdExpert, dtrackManager) {
  if ((thresholdAction === 'warn' || thresholdAction === 'error') && thresholdExpert.areThresholdsValidated()) {
    
    console.log(localize('ProcessingBOM'));
    await dtrackManager.waitBomProcessing(token);

    console.log(localize('RetrievingMetrics'));
    const metrics = await dtrackManager.waitMetricsRefresh();

    console.log(localize('VulnCount', metrics.critical, metrics.high, metrics.medium, metrics.low, metrics.unassigned, metrics.suppressed));

    try {
      thresholdExpert.validateThresholds(metrics)
    } catch (err) {
      if (thresholdAction === 'error') {
        throw(err)
      }

      tl.setResult(tl.TaskResult.SucceededWithIssues, err)
    }
  }
}

const run = async () => {
  tl.setResourcePath(path.join(__dirname, 'task.json'));

  const bomFilePath = tl.getPathInput('bomFilePath', true, true);
  const dtrackProjId = tl.getInput('dtrackProjId', true);
  const dtrackAPIKey = tl.getInput('dtrackAPIKey', true);
  const dtrackURI = tl.getInput('dtrackURI', true);
  const caFilePath = tl.getPathInput('caFilePath', false, true);

  const thresholdAction = tl.getInput('thresholdAction', false) || 'none';
  const thresholdCritical = tl.getInput('thresholdCritical', false) || -1;
  const thresholdHigh = tl.getInput('thresholdHigh', false) || -1;
  const thresholdMedium = tl.getInput('thresholdMedium', false) || -1;
  const thresholdLow = tl.getInput('thresholdLow', false) || -1;
  const thresholdUnassigned = tl.getInput('thresholdUnassigned', false) || -1;

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

  const thresholdExpert = new ThresholdExpert(
    Number.parseInt(thresholdCritical), 
    Number.parseInt(thresholdHigh), 
    Number.parseInt(thresholdMedium), 
    Number.parseInt(thresholdLow), 
    Number.parseInt(thresholdUnassigned));
  await validateThresholdsAsync(token, thresholdAction, thresholdExpert, dtrackManager);
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