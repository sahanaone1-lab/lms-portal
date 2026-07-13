const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config();

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function listFiles() {
  try {
    const command = new ListObjectsV2Command({ Bucket: process.env.AWS_S3_BUCKET_NAME });
    const response = await client.send(command);
    if (!response.Contents) { console.log('Bucket is empty'); return; }
    
    console.log(`Files in ${process.env.AWS_S3_BUCKET_NAME}:`);
    response.Contents.forEach(item => {
      // The public URL format for S3 (assuming bucket is public or objects are readable)
      const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
      console.log(`- ${item.Key} -> ${url}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
listFiles();
