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
}
export default DTrackManager;