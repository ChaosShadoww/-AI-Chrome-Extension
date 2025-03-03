import OpenAI from "openai";
import { Logger } from "./logger";
import dotenv from "dotenv";

dotenv.config();

const logger = new Logger("geminiClient");

//Rate limits:
// 15 RPM
// 1 million TPM
// 1,500 RPD

interface Message {
    role: "system" | "user" | "assistant";  
    content: string;
}

const GEMINI_MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b", 
    "gemini-2.0-flash-exp",
];

const MAX_Retries = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const openai = new OpenAI({

}