"use strict";

const tl = require("azure-pipelines-task-lib/task");
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const request = require('request');

const readFileAsync = promisify(fs.readFile);

async function sendBOM(bom, projId, apiKey, url) {
  return new Promise((resolve, reject) => {
    request('/api/v1/bom', {
      baseUrl: url,
      method: 'PUT',
      headers: { 'X-API-Key': apiKey },
      json: true,
      body: {
        "project": projId,
        "bom": bom
      }
    },
    (error, response) => {
      if (!error && response.statusCode == 200) {
        resolve(response);
      }

      reject({error, response});
    });
  });
}

const run = async () => {

  try {
    tl.setResourcePath(path.join(__dirname, 'task.json'));

    const bomFilePath = tl.getPathInput('bomFilePath', true, true);
    const dtrackProjId = tl.getInput('dtrackProjId', true);
    const dtrackAPIKey = tl.getInput('dtrackAPIKey', true);
    const dtrackURI = tl.getInput('dtrackURI', true);

    if (!tl.stats(bomFilePath).isFile()) {
      throw new Error(tl.loc('FileNotFound', bomFilePath));
    }

    const bom = (await readFileAsync(bomFilePath)).toString('base64');

    try {
      const res = await sendBOM(bom, dtrackProjId, dtrackAPIKey, dtrackURI);

      console.log('StatusCode:', res.statusCode)
      console.log('StatusMessage:', res.statusMessage)
      console.log('Content:', JSON.stringify(res.body))
    } 
    catch (err) {
      if (err.error) {
        throw new Error(tl.loc('BOMUploadFailed', `${JSON.stringify(err.error)}`));
      }

      throw new Error(tl.loc('BOMUploadFailed', `${err.response.statusCode} - ${err.response.statusMessage}`));
    }
  }
  catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
};

run();