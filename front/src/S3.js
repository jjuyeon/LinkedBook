import S3 from "react-aws-s3";

const config = {
  bucketName: "linkedbook",
  dirName: "images" /* optional */,
  region: "ap-northeast-2",
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
};

const ReactS3Client = new S3(config);
export default ReactS3Client;
