'use strict';

const aws = require('aws-sdk');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

console.log(__dirname);
let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);
console.log(config);

const bucketName = config.bucket;

aws.config.update({
    accessKeyId: config.awsAccessId,
    secretAccessKey: config.awsSecretKey,
    region: config.region
});

const s3 = new aws.S3();

const url = async (event) => {
    console.log('Issuing signed URL for upload to S3 Bucket: ', bucketName);

    return await getUploadURL();
}

const getUploadURL = async () => {
    const actionId = uuidv4();

    const s3Params = {
      Bucket: bucketName,
      Key:  `${actionId}.jpg`,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };

    console.log(s3Params);
    
    return new Promise((resolve, reject) => {
        let uploadURL = s3.getSignedUrl('putObject', s3Params);

        console.log(uploadURL);

        resolve({
            "statusCode": 200,
            "isBase64Encoded": false,
            "headers": { "Access-Control-Allow-Origin": "*" },
            "body": JSON.stringify({
                "uploadURL": uploadURL,
                "photoFilename": `${actionId}.jpg`
            })
        });

        reject({
            "statusCode": 404,
            "headers": { "Access-Control-Allow-Origin": "*" },
            "body": "A funky error occurred and I am not happy about it!"
        });
    });
}

module.exports = {
    url
}