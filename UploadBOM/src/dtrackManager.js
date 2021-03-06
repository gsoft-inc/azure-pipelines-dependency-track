import {localize} from './localization.js'

class DTrackManager {
  constructor(dtrackClient, projectId) {
    this.dtrackClient = dtrackClient;
    this.projectId = projectId;
  }

  async getProjectInfo() {
    const res = await this.dtrackClient.getProjectInfo(this.projectId);
    return JSON.parse(res.body);
  }

  async uploadBomAsync(bom) {
    try {
      const res = await this.dtrackClient.uploadBomAsync(this.projectId, bom);
      return res.body.token;
    }
    catch (err) {
      if (err.error) {
        let errorMsg;
        try {
          errorMsg = JSON.stringify(err.error);
        }
        catch {
          errorMsg = err.error;
        }

        throw new Error(localize('BOMUploadFailed', `${errorMsg}`));
      } else if (err.response) {
        throw new Error(localize('BOMUploadFailed', `${err.response.statusCode} - ${err.response.statusMessage}`));
      }

      throw new Error(localize('BOMUploadFailed', `${err}`));
    }
  }

  async waitBomProcessing(token) {
    let processing = true;
    while (processing) {
      await this.sleepAsync(2000);
      console.log(localize('Polling'));
      processing = await this.dtrackClient.pullProcessingStatusAsync(token);
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
    const res = await this.dtrackClient.getProjectMetricsAsync(this.projectId);
    return JSON.parse(res.body);
  }

  sleepAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
export default DTrackManager;