import {localize} from './localization.js'

class DTrackManager {
  constructor(dtrackClient, projectId) {
    this.dtrackClient = dtrackClient;
    this.projectId = projectId;
  }

  async uploadBomAsync(bom) {
    try {
      const res = await this.dtrackClient.uploadBomAsync(this.projectId, bom);
      return res.body.token;
    }
    catch (err) {
      if (err.error) {
        throw new Error(localize('BOMUploadFailed', `${JSON.stringify(err.error)}`));
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
      let res = await this.dtrackClient.pullProcessingStatusAsync(token);
      processing = res.body.processing;
    }
  }

  async getProjectMetricsAsync(){
    const metrics = await this.dtrackClient.getProjectMetricsAsync(this.projectId);
    console.log(`metrics: ${JSON.stringify(metrics.body)}`);
    return metrics.body;
  }

  sleepAsync(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
export default DTrackManager;