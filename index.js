const JsReport = require('jsreport')
const FS = require('fs-extra')
const path = require('path')
const os = require('os')
const { S3 } = require('@aws-sdk/client-s3')

const chromium = require('@sparticuz/chromium')
chromium.setHeadlessMode = true

let jsreport

console.log('starting')

const init = (async () => {
  // this speeds up cold start by some ~500ms
  precreateExtensionsLocationsCache()
  try {
    jsreport = JsReport({
      configFile: path.join(__dirname, 'prod.config.json'),
      chrome: {
        launchOptions: {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        },
      },
    })
  } catch (e) {
    console.error('Error creating jsreport object:', e)
    throw e
  }
  try {
    await FS.copy(path.join(__dirname, 'data'), '/tmp/data')
  } catch (e) {
    console.error('Error copying data folder:', e)
    throw e
  }
  let jsreportInitialized
  try {
    jsreportInitialized = jsreport.init()
  } catch (e) {
    console.error('Error initializing jsreport:', e)
    throw e
  }
  return jsreportInitialized
})()

exports.handler = async (event) => {
  console.log('handling event')
  try {
    await init
  } catch (err) {
    console.error('Error initializing jsreport:', err)
    return {
      statusCode: 500,
      body: {
        title: 'Error initializing jsreport',
        message: err.message,
      },
    }
  }
  const bucketName = event.s3Bucket
  const region = event.region
  const filePath = event.s3Key
  let payload = {}
  try {
    payload = await readPayloadFromS3(bucketName, filePath)
  } catch (err) {
    console.error('Error reading payload from S3:', err)
    return {
      statusCode: 500,
      body: {
        title: 'Error reading payload from S3',
        message: err.message,
      },
    }
  }
  const jsonPayload = JSON.parse(payload)

  let res = {}
  try {
    res = await jsreport.render(jsonPayload.renderRequest)
  } catch (err) {
    console.error('Error rendering report:', err)
    return {
      statusCode: 500,
      body: {
        title: 'Error rendering report',
        message: err.message,
      },
    }
  }
  const reportName = `reports/${res.meta.profileId}.pdf`
  let data = {}
  try {
    data = await savePDFToS3(bucketName, reportName, res.content)
  } catch (err) {
    console.error('Error saving PDF to S3:', err)
    return {
      statusCode: 500,
      body: {
        title: 'Error saving PDF to S3',
        message: err.message,
      },
    }
  }
  const url =
    data.$metadata.httpStatusCode == 200
      ? `https://${bucketName}.s3.${region}.amazonaws.com/${reportName}`
      : 'There was an error generating the report'

  const response = {
    statusCode: data.$metadata.httpStatusCode,
    body: url,
    logs: res.logs || 'empty',
  }
  return response
}

async function readPayloadFromS3(bucketName, filePath) {
  const s3 = new S3()
  const key = decodeURIComponent(filePath.replace(/\+/g, ' '))
  const params = {
    Bucket: bucketName,
    Key: key,
  }

  try {
    const data = await s3.getObject(params)
    const bodyContents = await streamToString(data.Body)
    return bodyContents
  } catch (err) {
    console.error('Error reading payload from S3:', err)
    throw err
  }
}

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })

async function savePDFToS3(bucketName, reportName, data) {
  const params = {
    Bucket: bucketName,
    Key: reportName,
    Body: data,
    Tagging: 'source=jsreport',
  }

  const s3client = new S3()

  return new Promise((resolve, reject) => {
    s3client.putObject(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function precreateExtensionsLocationsCache() {
  const rootDir = path.join(path.dirname(require.resolve('jsreport')), '../../')
  const locationsPath = path.join(rootDir, 'node_modules/locations.json')

  if (FS.existsSync(locationsPath)) {
    console.log('locations.json found, extensions crawling will be skipped')
    const locations = JSON.parse(FS.readFileSync(locationsPath)).locations
    const tmpLocationsPath = path.join(
      os.tmpdir(),
      'jsreport',
      'core',
      'locations.json'
    )
    FS.ensureFileSync(tmpLocationsPath)
    FS.writeFileSync(
      tmpLocationsPath,
      JSON.stringify({
        [path.join(rootDir, 'node_modules') + '/']: {
          rootDirectory: rootDir,
          locations: locations.map((l) =>
            path.join(rootDir, l).replace(/\\/g, '/')
          ),
          lastSync: Date.now(),
        },
      })
    )
  } else {
    console.log('locations.json not found, the startup will be a bit slower')
  }
}
