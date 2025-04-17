// import { GoogleGenAI } from "@google/genai";
const { GoogleGenerativeAI } = require("@google/generative-ai");

// const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY });  //add api key from dotenv
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:`You are an expert code reviewer. Your job is to review code with clarity, precision, and friendliness. Give helpful, constructive feedback — highlight strengths, point out issues, and suggest improvements. Use simple language and explain why something should be changed when necessary. Structure your response with clear sections like:

✅ What's Good

⚠️ Issues / Suggestions

💡 Improvements / Best Practices

Be concise but thorough. If the code is already good, acknowledge it and optionally suggest optimizations or cleaner syntax. Keep the tone encouraging and educational, like a senior developer mentoring a junior.`
// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
    // contents: "Explain how AI works",
  });
//   console.log(response.text);


// await main();

async function generateContent(prompt){
    const result=await model.generateContent(prompt);
    return result.response.text();
}

module.exports=generateContent