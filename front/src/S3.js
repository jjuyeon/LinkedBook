import S3 from "react-aws-s3";

const config = {
  bucketName: "{your_bucketName}",
  dirName: "{your_dirName}" /* optional */,
  region: "{your_region}",
  accessKeyId: "{your_accessKeyId}",
  secretAccessKey: "{your_secretAccessKey}",
};

const ReactS3Client = new S3(config);
export default ReactS3Client;
