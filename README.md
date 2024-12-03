# jsreport-aws-lambda-starter-kit

This repository helps you to get started with running jsreport serverless in AWS Lambda. The full documentation can be found here

**[https://jsreport.net/learn/aws-lambda-serverless](https://jsreport.net/learn/aws-lambda-serverless)**

# BSP NOTES:

These are the custom steps required to make the lambda to work. We recommend to use node v20.2.0 which is the used version to test the functionality.

Basically we followed the steps from the link above. But made some small modifications because we are using AWS S3 to load data and save the PDFs generated.

- In the lambda configuration set the memory to `3008MB`, Ephemeral storage to `4096MB` and timeout to `15 min`
- The role associated with the lambda, should have the following permissions policies:
  `AmazonS3FullAccess` and `AWSLambdaBasicExecutionRole`
