const fs = require('fs')
const { exec } = require('child_process');
const minimist = require('minimist');

async function getPublishedVersion(token) {
  return new Promise((resolve, reject) => {
    exec(
      'tfx extension show -t ' + token + ' --publisher officevibe --extension-id dependency-track-build-tasks --json',
      (err, stdout, stderr) => {
        if (err) {
          reject({ err, stderr });
          return
        }

        try {
          resolve(JSON.parse(stdout).versions[0].version)
        }
        catch (err) {
          reject(err)
        }
      });
  });
}

async function getJsonContent(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, jsonString) => {
      if (err) {
        reject('Error reading file from disk: ' + err)
        return
      }

      try {
        resolve(JSON.parse(jsonString))
      } catch (err) {
        reject('Error parsing JSON string: ' + err)
      }
    })
  });
}

async function setJsonContent(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(content), err => {
      if(err) {
        reject(err)
      }
      else {
        resolve()
      }
    })
  })
}

const run = async (args) => {
  const publishedVersion = await getPublishedVersion(args.token)
  console.log("Published extension version is:", publishedVersion)

  let [major, minor, patch] = publishedVersion.split('.')

  // bump patch version by 1
  patch++

  console.log(`New extention version will be: ${major}.${minor}.${patch}`)

  let filePath = './vss-extension.json'
  const extension = await getJsonContent(filePath)
  extension.version = `${major}.${minor}.${patch}`
  await setJsonContent(filePath, extension)
  console.log('Updated configuration file: ' + filePath)

  filePath = './UploadBOM/task.json'
  const uploadBOM = await getJsonContent(filePath)
  uploadBOM.version = {
    'Major': parseInt(major),
    'Minor': parseInt(minor),
    'Patch': patch 
  }
  await setJsonContent(filePath, uploadBOM)
  console.log('Updated configuration file: ' + filePath)
}

let args = minimist(process.argv.slice(2), {
  alias: {
      t: 'token'
  },
});

run(args);