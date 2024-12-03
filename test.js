const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda')
const fs = require('fs')

//TODO set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env variables
const lambdaClient = new LambdaClient({
  region: 'us-west-1',
})

const payload = {
  s3Bucket: 'jsreportbucket3',
  s3Key: 'lambda-payloads/62557629-913f-4fc6-8463-c7ad6ad15244.json',
  region: 'us-west-1',
}

const invokeLambda = async () => {
  const command = new InvokeCommand({
    FunctionName: 'jsreportfunction',
    Payload: Buffer.from(JSON.stringify(payload)),
  })

  try {
    const response = await lambdaClient.send(command)
    const data = JSON.parse(Buffer.from(response.Payload).toString())
    console.log('Lambda response:', response)
    console.log('data', data)
  } catch (err) {
    console.error('Error invoking Lambda:', err)
  }
}

invokeLambda()
