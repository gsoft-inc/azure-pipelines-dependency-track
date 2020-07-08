import request from 'request'

class DTrackClient {
  constructor(url, apiKey, caFile) {
    this.baseUrl = url;
    this.apiKey = apiKey;
    this.caFile = caFile;

    this.baseOptions = {
      baseUrl: this.baseUrl,
      headers: { 'X-API-Key': this.apiKey },
      json: true,
      ...(this.caFile ? { ca: this.caFile } : {}),
    }
  }

  uploadBomAsync(projId, bom) {
    return new Promise((resolve, reject) => {
      request('/api/v1/bom', {
        ...this.baseOptions,
        method: 'PUT',
        body: {
          "project": projId,
          "bom": bom.toString('base64')
        }
      },
        (error, response) => {
          if (!error && response.statusCode == 200) {
            resolve(response);
          }

          reject({ error, response });
        });
    });
  }
}
export default DTrackClient;