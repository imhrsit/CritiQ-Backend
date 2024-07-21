const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiAIRouter = express.Router();

require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

const generationConfig = {
    temperature: 0.5,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

geminiAIRouter.post("/api/gemini", async (req, res) => {
    try {
        const { message } = req.body;
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });
        const result = await chatSession.sendMessage(message);
        res.json({ response: result.response.text() });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = geminiAIRouter;

