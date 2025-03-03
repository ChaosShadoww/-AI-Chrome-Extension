require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Protocol, ProtocolError } = require("puppeteer");


type Message = {
    role: "system" | "user" | "assistant"
    content: string
}

// Initialize Express app
const app = express()
const port = process.env.PORT || 3000


// Middleware
app.use(express.json())

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/api/chat", async (req, res) => {

    try {

        const { message, context = {} } = req.body;


        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const messages: Message[] = [
            {
                role: "system",
                content: `You are now an AI writing assistant. Complete the user's text naturally, continuing their though or sentence. 
                Respond ONLY with the completion text, no explantions or additional content. Keep the completion concise and relevant.

                Current webpage context:
                ${JSON.stringify(context)}
                `
            },
            {
                role: "user",
                content: message
            }
        ]

        console.log(messages);

        // Generate response
        const result = await getGeminiCompletion(messages);

        res.json({ response: result })
    } catch (error) {
        console.error('Error in chat endpoint:', error)
        res.status(500).json({ error: "Internal server error" })
    }
})

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
