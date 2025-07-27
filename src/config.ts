import { ServerConfigInterface } from "./types/config.dto";
import { config } from "dotenv";
config();

if (!process.env.TOKEN_KEY) {
  throw new Error("TOKEN_KEY is not defined in .env file");
}

export const serverConfig: ServerConfigInterface = {
  PORT: parseInt(process.env.PORT || "4000", 10),
  TOKEN_KEY: process.env.TOKEN_KEY,
};

export const waitConfig = {
  MAX_FAILED_ATTEMPTS: parseInt(process.env.MAX_FAILED_ATTEMPTS || "5"),
  LOCK_TIME_SECONDS: parseInt(process.env.LOCK_TIME_SECONDS || "30"),
};
