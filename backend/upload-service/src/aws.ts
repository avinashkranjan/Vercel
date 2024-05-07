import { S3 } from "aws-sdk";
import fs from "fs";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, ENDPOINT } from "./util/secrets";

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  endpoint: ENDPOINT,
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  await s3
    .upload({
      Body: fileContent,
      Bucket: "vercel",
      Key: fileName,
    })
    .promise();
};
