import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_APP_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatSession = model.startChat({
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  },
  history: [],
});

export async function sendMessageToGemini(message) {
  try {
    const promptPrefix = `You're a task assistant. Help the user manage their tasks better.
Right now they are viewing the "Work" category. let the text response be short and concise not more than 3 lines`;
    const finalMessage = `${promptPrefix}${message}`;

    const result = await chatSession.sendMessage(finalMessage);
    const response = await result.response.text();
    return response;
  } catch (error) {
    console.error("Error sending message to chat:", error);
    throw error;
  }
}
