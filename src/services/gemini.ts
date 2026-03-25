import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export type AnalysisType = 'pros-cons' | 'comparison' | 'swot';

export interface AnalysisResult {
  title: string;
  content: string;
  summary: string;
}

export async function generateAnalysis(decision: string, type: AnalysisType): Promise<AnalysisResult> {
  const model = "gemini-3.1-pro-preview";
  
  const prompts = {
    'pros-cons': `Analyze the following decision by providing a detailed list of Pros and Cons. Decision: "${decision}". Format the output as a clear markdown list with a brief summary at the end.`,
    'comparison': `Create a comparison table for the options involved in this decision: "${decision}". If there are multiple options, compare them across key criteria. If it's a yes/no decision, compare the "Do it" vs "Don't do it" scenarios. Format as a markdown table with a brief summary.`,
    'swot': `Perform a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the following decision: "${decision}". Format as a markdown document with clear headings and a brief summary.`
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompts[type],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING, description: "The markdown content of the analysis" },
          summary: { type: Type.STRING, description: "A one-sentence summary/recommendation" }
        },
        required: ["title", "content", "summary"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as AnalysisResult;
}
