import {localize} from './localization.js'
import Utils from './utils.js'

class DtrackManager {
  constructor(dtrackClient) {
    this.dtrackClient = dtrackClient;
  }

  async getProjetUUID(name, version) {
    try {
      const projectId = await this.dtrackClient.getProjectUUID(name, version);
      return projectId;
    }
    catch (err) {
      console.log(Utils.getErrorMessage(err));
      throw new Error(localize('ProjectNotFound', name, version));
    }
  }

  async getProjectInfo(projectId) {
    const info = await this.dtrackClient.getProjectInfo(projectId);
    return info;
  }

  async uploadBomAsync(projectId, bom) {
    try {
      const token = await this.dtrackClient.uploadBomAsync(projectId, bom);
      return token;
    }
    catch (err) {
      throw new Error(localize('BOMUploadFailed', Utils.getErrorMessage(err)));
    }
  }

  async uploadBomAndCreateProjectAsync(name, version, bom) {
    try {
      const token = await this.dtrackClient.uploadBomAndCreateProjectAsync(name, version, bom);
      return token;
    }
    catch (err) {
      throw new Error(localize('BOMUploadFailed', Utils.getErrorMessage(err)));
    }
  }

  async waitBomProcessing(token) {
    let processing = true;
    while (processing) {
      await Utils.sleepAsync(2000);
      console.log(localize('Polling'));
      try {
        processing = await this.dtrackClient.pullProcessingStatusAsync(token);
      }
      catch (err) {
        throw new Error(localize('PollingFailed', Utils.getErrorMessage(err)));
      }
    }
  }

  async waitMetricsRefresh(projectId) {
    const lastBomImport = new Date((await this.getProjectInfo(projectId)).lastBomImport);
    let lastOccurrence = undefined;
      
    do {
      await Utils.sleepAsync(2000);
      console.log(localize('Polling'));
      try {
        lastOccurrence = await this.dtrackClient.getLastMetricCalculationDate(projectId);
      }
      catch (err) {
        throw new Error(localize('PollingFailed', Utils.getErrorMessage(err)));
      }
    } while (lastOccurrence < lastBomImport)

    console.log(localize('LastBOMImport', lastBomImport));
    console.log(localize('LastMetricUpdate', lastOccurrence));
  }

  async getProjectMetricsAsync(projectId) {
    try {
      const metrics = await this.dtrackClient.getProjectMetricsAsync(projectId);
      return metrics;
    }
    catch (err) {
      throw new Error(localize('PollingFailed', Utils.getErrorMessage(err)));
    }
  }
}
export default DtrackManager;