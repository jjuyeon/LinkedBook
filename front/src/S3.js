import S3 from "react-aws-s3";

const config = {
  bucketName: "linkedbook",
  dirName: "images" /* optional */,
  region: "ap-northeast-2",
  accessKeyId: "{your_accessKeyId}",
  secretAccessKey: "{your_secretAccessKey}",
};

const ReactS3Client = new S3(config);
export default ReactS3Client;
