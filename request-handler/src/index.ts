import express from "express";
import { S3 } from "aws-sdk";
import { ACCESS_KEY_ID, SECRET_ACCESS_KEY, ENDPOINT } from "./util/secrets";

const s3 = new S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  endpoint: ENDPOINT,
});

const app = express();

app.get("/*", async (req, res) => {
  const host = req.hostname;

  const id = host.split(".")[0];
  const filePath = req.path;

  const contents = await s3
    .getObject({
      Bucket: "vercel",
      Key: `dist/${id}${filePath}`,
    })
    .promise();

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);

  res.send(contents.Body);
});

app.listen(3001);
