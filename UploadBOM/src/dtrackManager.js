import {localize} from './localization.js'

class DTrackManager {
  constructor(dtrackClient, projectId) {
    this.dtrackClient = dtrackClient;
    this.projectId = projectId;
  }

  async getProjectInfo() {
    const info = await this.dtrackClient.getProjectInfo(this.projectId);
    return info;
  }

  async uploadBomAsync(bom) {
    try {
      const token = await this.dtrackClient.uploadBomAsync(this.projectId, bom);
      return token;
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
      try {
        lastOccurrence = await this.dtrackClient.getLastMetricCalculationDate(this.projectId);
      }
      catch (err) {
        throw new Error(localize('PollingFailed', this.getErrorMessage(err)));
      }
    } while (lastOccurrence < lastBomImport)

    console.log(localize('LastBOMImport', lastBomImport));
    console.log(localize('LastMetricUpdate', lastOccurrence));
  }

  async getProjectMetricsAsync() {
    try {
      const metrics = await this.dtrackClient.getProjectMetricsAsync(this.projectId);
      return metrics;
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