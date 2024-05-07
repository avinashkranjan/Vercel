import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
}

export const ACCESS_KEY_ID = process.env["ACCESS_KEY_ID"];
export const SECRET_ACCESS_KEY = process.env["SECRET_ACCESS_KEY"];
export const ENDPOINT = process.env["ENDPOINT"];
