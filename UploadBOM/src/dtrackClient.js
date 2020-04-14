import request from 'request'

class DTrackClient {
  constructor(url, apiKey) {
    this.baseUrl = url;
    this.apiKey = apiKey;
  }

  uploadBomAsync(projId, bom) {
    return new Promise((resolve, reject) => {
      request('/api/v1/bom', {
        baseUrl: this.baseUrl,
        method: 'PUT',
        headers: { 'X-API-Key': this.apiKey },
        json: true,
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

  pullProcessingStatusAsync(token) {
    return new Promise((resolve, reject) => {
      request(`/api/v1/bom/token/${token}`, {
        baseUrl: this.baseUrl,
        method: 'GET',
        headers: { 'X-API-Key': this.apiKey }
      },
        (error, response) => {
          if (!error && response.statusCode == 200) {
            resolve(response);
          }

          reject({ error, response });
        });
    });
  }

  getProjectMetricsAsync(projId) {
    return new Promise((resolve, reject) => {
      request(`/api/v1/metrics/project/${projId}/current`, {
        baseUrl: this.baseUrl,
        method: 'GET',
        headers: { 'X-API-Key': this.apiKey }
      },
      (error, response) => {
        if (!error && response.statusCode == 200) {
          resolve(response);
        }
        
        reject({ error, response });
      });
    });
  }

  getProjectInfo(projId) {
    return new Promise((resolve, reject) => {
      request(`/api/v1/project/${projId}`, {
        baseUrl: this.baseUrl,
        method: 'GET',
        headers: { 'X-API-Key': this.apiKey }
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