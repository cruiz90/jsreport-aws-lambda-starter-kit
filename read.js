const { S3 } = require('@aws-sdk/client-s3')
const jsreport = require('jsreport')()
const fs = require('fs').promises

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

async function renderReport() {
  await jsreport.init()
  const payload = await readPayloadFromS3(
    'jsreportbucket3',
    'lambda-payloads/62557629-913f-4fc6-8463-c7ad6ad15244.json'
  )
  const jsonPayload = JSON.parse(payload)
  const result = await jsreport.render(jsonPayload.renderRequest)
  await fs.writeFile('report.pdf', result.content)
}

renderReport()

// readPayloadFromS3(
//   'jsreportbucket3',
//   'lambda-payloads/62557629-913f-4fc6-8463-c7ad6ad15243.json'
// ).then((data) => {
//   const jsonData = JSON.parse(data)
//   console.log(data)
// })
