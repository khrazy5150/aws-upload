# Uploading Objects to S3 Presigned URLs
This is a micro-service that allows users to upload image files to an S3 bucket using signed URLs. This project makes use of Serverless Framework for rapid deployment of necessary AWS services.

## Setup

Edit the config.json file in the root directory:
1. change the service name
2. change the name of the bucket (bucket name must not already exist because it will be created)
3. enter your AWS Access Key ID
4. enter your AWS Secret Key
5. change the region (this is optional)

## Back-End Deployment

Use Serverless Framework (Serverless Framework must already be installed in your machine). 
1. Install the dependecies with `npm install` 
2. Run `sls deploy` in the project root to start the deployment.

Serverless Framework will exclude the app directory.

## Front-End Deployment
The front-end is inside the upload folder of the app directory. This is a NUXT application front-end (Vue's answer to React's Next) which is way easier to use than Angular or React and just as powerful. 

1. Locate the pages directory and open the index.vue file
2. Under "scripts" change API_ENDPOINT to the API end-point URL created by Serverless Framework
3. Under "methods" look for uploadImage. This method will use the signed URL to upload the image

For some reason, the uploadImage method gets a 403 - Forbidden error when using the signed URL to upload the file to S3.

To run the front-end locally in development mode:

1. open a terminal and navigate to app directory
2. run `npm run dev`
3. you'll get a url to copy and paste on your browser similar to: http://localhost:3000
4. any changes to the code will immediately be shown on the browser without the need to refresh it

To build and run the front-end for production, make sure you're inside app directory and:
1. run `npm run build`
2. run `npm start`

## Uninstall/Remove
To uninstall/remove the back-end code from AWS run `sls remove` from the project root (the directory containing the serverless.yml file)