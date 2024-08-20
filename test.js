const AWS = require('aws-sdk')
const fs = require('fs')

//TODO set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env variables
const lambda = new AWS.Lambda({
  region: 'us-west-1',
})

const payload = {
  s3Bucket: 'jsreportbucket3',
  s3Key: 'lambda-payloads/62557629-913f-4fc6-8463-c7ad6ad15244.json',
}

lambda.invoke(
  {
    FunctionName: 'jsreportfunction',
    Payload: JSON.stringify(payload),
  },
  (err, res) => {
    if (err) {
      return console.error(err)
    }

    const response = JSON.parse(res.Payload)
    if (response.errorMessage) {
      console.log(response.errorMessage)
      console.log(response.stackTrace)
    } else {
      fs.writeFileSync('report.pdf', Buffer.from(response.body, 'base64'))
    }
  }
)
