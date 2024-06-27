const JsReport = require('jsreport')
const FS = require('fs-extra')
const path = require('path')
const os = require('os')
const { S3 } = require("@aws-sdk/client-s3")

const chromium = require("@sparticuz/chromium")
chromium.setHeadlessMode = true

let jsreport

console.log('starting')

const init = (async () => {
    // this speeds up cold start by some ~500ms
    precreateExtensionsLocationsCache()

    jsreport = JsReport({
        configFile: path.join(__dirname, 'prod.config.json'),
        chrome: {
            launchOptions: {
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            }
        }
    })
    await FS.copy(path.join(__dirname, 'data'), '/tmp/data')
    return jsreport.init()
})()

exports.handler = async (event) => {
    console.log('handling event')
    await init

    const res = await jsreport.render(event.renderRequest)
    const reportName = `reports/${res.meta.profileId}.pdf`
    const data = await savePDFToS3(reportName, res.content)
    const url = data.$metadata.httpStatusCode == 200 ? `https://jsreportbucket3.s3.us-west-1.amazonaws.com/${reportName}`:"There was an error generating the report" 

    const response = {
        statusCode: data.$metadata.httpStatusCode,
        body: url
    }
    return response
}


async function savePDFToS3 (reportName, data) {
    const params = {
        Bucket: "jsreportbucket3",
        Key: reportName,
        Body: data,
        Tagging: "source=jsreport"
    }

    const s3client = new S3();

    return new Promise((resolve, reject) => {
        s3client.putObject(params, function(err, data) {
            if(err) {
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
        const tmpLocationsPath = path.join(os.tmpdir(), 'jsreport', 'core', 'locations.json')
        FS.ensureFileSync(tmpLocationsPath)
        FS.writeFileSync(tmpLocationsPath, JSON.stringify({
            [path.join(rootDir, 'node_modules') + '/']: {
                rootDirectory: rootDir,
                locations: locations.map(l => path.join(rootDir, l).replace(/\\/g, '/')),
                lastSync: Date.now()
            }
        }))
    } else {
        console.log('locations.json not found, the startup will be a bit slower')
    }
}