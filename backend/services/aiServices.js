const { GoogleGenAI } = require("@google/genai");
const { searchProducts } = require("./searchService");
const { buildPrompt } = require("./promptService");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateResponse = async (userMessage) => {
  try {
    console.log("User Message:", userMessage);

    // Step 1
    const matchedProducts = await searchProducts(userMessage);
    console.log("Matched Products:", matchedProducts.length);

    // Step 2
    const prompt = buildPrompt(userMessage, matchedProducts);
    console.log("Prompt Built Successfully");

    // Step 3
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("Gemini Response:", response);

    return response.text;

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};

module.exports = {
  generateResponse,
};