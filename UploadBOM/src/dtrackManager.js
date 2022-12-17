import {localize} from './localization.js'

class DTrackManager {
  constructor(dtrackClient, projectId) {
    this.dtrackClient = dtrackClient;
    this.projectId = projectId;
  }

  async getProjectInfo() {
    const res = await this.dtrackClient.getProjectInfo(this.projectId);
    console.log(res.body);
    return JSON.parse(res.body);
  }

  async uploadBomAsync(bom) {
    try {
      const res = await this.dtrackClient.uploadBomAsync(this.projectId, bom);
      console.log(res.body);
      return res.body.token;
    }
    catch (err) {
      throw new Error(localize('BOMUploadFailed', this.getErrorMessage(err)));
    }
  }

  async waitBomProcessing(token) {
    let processing = true;
    while (processing) {
      await this.sleepAsync(2000);
      console.log(localize('Polling'));
      try {
        processing = await this.dtrackClient.pullProcessingStatusAsync(token);
      }
      catch (err) {
        throw new Error(localize('PollingFailed', this.getErrorMessage(err)));
      }
    }
  }

  async waitMetricsRefresh() {
    const lastBomImport = new Date((await this.getProjectInfo()).lastBomImport);
    let metrics = undefined;
    let lastOccurrence = undefined;
      
    do {
      await this.sleepAsync(2000);
      console.log(localize('Polling'));
      metrics = await this.getProjectMetricsAsync();
      lastOccurrence = new Date(metrics.lastOccurrence);
    } while (lastOccurrence < lastBomImport)

    console.log(localize('LastBOMImport', lastBomImport));
    console.log(localize('LastMetricUpdate', lastOccurrence));

    return metrics;
  }

  async getProjectMetricsAsync() {
    try {
      const res = await this.dtrackClient.getProjectMetricsAsync(this.projectId);
      console.log(res.body);
      return JSON.parse(res.body);
    }
    catch (err) {
      throw new Error(localize('PollingFailed', this.getErrorMessage(err)));
    }
  }

  sleepAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getErrorMessage(err){
    if (err.error) {
      let errorMsg;
      try {
        errorMsg = JSON.stringify(err.error);
      }
      catch {
        errorMsg = err.error;
      }

      return `${errorMsg}`;
    } else if (err.response) {
      return `${err.response.statusCode} - ${err.response.statusMessage}`;
    }

    return `${err}`;
  }
}
export default DTrackManager;