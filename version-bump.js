const fs = require('fs')
const { exec } = require('child_process');
const minimist = require('minimist');

async function getPublishedVersion(token, publisher, extensionId) {
  return new Promise((resolve, reject) => {
    exec(
      `tfx extension show -t ${token} --publisher ${publisher} --extension-id ${extensionId} --json`,
      (err, stdout, stderr) => {
        if (err) {
          reject({ err, stderr });
          return
        }

        const extensionData = JSON.parse(stdout)
        if (!extensionData) {
          // Default to 1.0.0 if no extension is found in the market
          resolve({major: 1, minor: 0, patch: 0})
        }

        try {
          let [major, minor, patch] = extensionData.versions[0].version.split('.')
          resolve({
            major: parseInt(major), 
            minor: parseInt(minor), 
            patch: parseInt(patch)
          })
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

async function updateJsonContent(filePath, update) {
  let content = await getJsonContent(filePath)
  update(content)
  await setJsonContent(filePath, content)
  console.log('Updated file: ' + filePath)
}

const run = async (args) => {
  console.log(`Updating extention information for ${args['release-type']}`)

  let settings = {
    id: 'dependency-track-vsts',
    name: 'Dependency Track',
    publisher: 'GSoft',
    version: {major: 1, minor: 0, patch: 0},
    galleryFlags: ['Free', 'Public']
  }

  const prodVersion = await getPublishedVersion(args.token, settings.publisher, settings.id)

  switch (args['release-type']) {
    case 'dev':
      settings.id += '-dev'
      settings.name += ' (dev)'
      settings.publisher = 'gsoft-dev'
      settings.galleryFlags = ['Free', 'Private']

      let devVersion = await getPublishedVersion(args.token, settings.publisher, settings.id)
      
      settings.version.major = Math.max(prodVersion.major, devVersion.major)
      settings.version.minor = Math.max(prodVersion.minor, devVersion.minor)
      settings.version.patch = (prodVersion.major != devVersion.major || prodVersion.minor != devVersion.minor) ? 1 : devVersion.patch++
      break;
    case 'hotfix':
      settings.version = prodVersion
      settings.version.patch++
      break;
    case 'prod':
      settings.version = prodVersion
      settings.version.minor++
      settings.version.patch = 0
      break;
  }

  console.log('New extention information will be:', settings)

  await updateJsonContent('./vss-extension.json', (content) => {
    content.id = settings.id
    content.version = `${settings.version.major}.${settings.version.minor}.${settings.version.patch}`
    content.name = settings.name
    content.publisher = settings.publisher
    content.galleryFlags = settings.galleryFlags
  })

  await updateJsonContent('./UploadBOM/task.json', (content) => {
    content.version = {
      'Major': settings.version.major,
      'Minor': settings.version.minor,
      'Patch': settings.version.patch 
    }
  })
}

let args = minimist(process.argv.slice(2), {
  string: ['token', 'release-type'],
  default: { 'release-type': 'dev' }
});

run(args);