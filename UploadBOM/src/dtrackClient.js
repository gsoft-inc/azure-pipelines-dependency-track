import request from 'request'

class DTrackClient {
  constructor(url, apiKey, caFile) {
    this.baseUrl = url;
    this.apiKey = apiKey;
    this.caFile = caFile;

    this.baseOptions = {
      baseUrl: this.baseUrl,
      headers: { 'X-API-Key': this.apiKey },
      ...(this.caFile ? { ca: this.caFile } : {}),
    }
  }

  uploadBomAsync(projId, bom) {
    return new Promise((resolve, reject) => {
      request('/api/v1/bom', {
        ...this.baseOptions,
        method: 'PUT',
        json: true,
        body: {
          "project": projId,
          "bom": bom.toString('base64')
        }
      },
        (error, response) => {
          if (!error && response.statusCode == 200) {
            resolve(JSON.parse(response.body).token);
          }

          reject({ error, response });
        });
    });
  }

  pullProcessingStatusAsync(token) {
    return new Promise((resolve, reject) => {
      request(`/api/v1/bom/token/${token}`, {
        ...this.baseOptions,
        method: 'GET',
      },
        (error, response) => {
          if (!error && response.statusCode == 200) {
            resolve(JSON.parse(response.body).processing);
          }

          reject({ error, response });
        });
    });
  }

  getProjectMetricsAsync(projId) {
    return new Promise((resolve, reject) => {
      request(`/api/v1/metrics/project/${projId}/current`, {
        ...this.baseOptions,
        method: 'GET',
      },
      (error, response) => {
        if (!error && response.statusCode == 200) {
          resolve(JSON.parse(response.body));
        }
        
        reject({ error, response });
      });
    });
  }

  getLastMetricCalculationDate(projId) {
    return new Promise((resolve, reject) => {
      request(`/api/v1/metrics/project/${projId}/current`, {
        ...this.baseOptions,
        method: 'GET',
      },
      (error, response) => {
        if (!error && response.statusCode == 200) {
          
          let lastOccurrence = new Date(0);

          // Dependency Track might return an empty response body if metrics have never been calculated before.
          if(response.body) {
            lastOccurrence = new Date(JSON.parse(response.body).lastOccurrence);
          } 

          resolve(lastOccurrence);
        }
        
        reject({ error, response });
      });
    });
  }

  getProjectInfo(projId) {
    return new Promise((resolve, reject) => {
      request(`/api/v1/project/${projId}`, {
        ...this.baseOptions,
        method: 'GET',
      },
      (error, response) => {
        if (!error && response.statusCode == 200) {
          resolve(JSON.parse(response.body));
        }
        
        reject({ error, response });
      });
    });
  }
}
export default DTrackClient;