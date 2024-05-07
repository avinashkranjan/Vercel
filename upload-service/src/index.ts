import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import morgan from "morgan";

import { getAllFiles } from "./file";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";
import * as dotenv from "dotenv";
import { generate } from "./util/uniqueIdGen";

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

dotenv.config();

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

  const files = getAllFiles(path.join(__dirname, `output/${id}`));

  console.log(
    `Deploying ${files.length} files to S3 bucket. This may take a few minutes.`
  );

  files.forEach(async (file) => {
    await uploadFile(file.slice(__dirname.length + 1), file);
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));
  publisher.lPush("build-queue", id);

  publisher.hSet("status", id, "uploaded");

  res.status(200).json({
    id: id,
  });
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});

app.listen(3000);
