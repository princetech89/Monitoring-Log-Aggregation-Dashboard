
import { GoogleGenAI } from "@google/genai";
import { LogEntry } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeLogs(logs: LogEntry[]) {
    const logSummary = logs.map(l => `[${l.timestamp}] ${l.level}: ${l.service} - ${l.message}`).join('\n');
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the following system logs for anomalies, performance bottlenecks, or critical errors. Provide a concise summary and suggested remediation steps.
        
        Logs:
        ${logSummary}`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Failed to analyze logs. Please check system health manually.";
    }
  }

  async explainError(log: LogEntry) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain this specific error log entry for a DevOps engineer. Tell me what likely caused it and how to troubleshoot it.
        
        Log Entry:
        [${log.level}] Service: ${log.service}
        Message: ${log.message}
        Metadata: ${JSON.stringify(log.metadata || {})}`,
      });
      return response.text;
    } catch (error) {
      return "Unable to provide AI insights at this moment.";
    }
  }
}

export const geminiService = new GeminiService();
