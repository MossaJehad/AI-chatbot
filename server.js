import * as dotenv from 'dotenv';
dotenv.config();

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ });

import express from 'express';
import cors from 'cors';
import path from 'path';

// Use import.meta.url to get the directory name in ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Your /dream route
app.post('/dream', async (req, res) => {
    console.log("Request received:", req.body);
    try {
        const prompt = req.body.prompt;
        console.log("Prompt received:", prompt);
        const response = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama3-8b-8192",
        });
        console.log(response.choices[0].message.content);
        res.send({ result: response.choices[0].message.content });
    } catch (error) {
        console.error("Error generating response:", error.response?.data || error.message);
        res.status(500).send({ error: "Error generating response" });
    }
});

// Serve the index.html file at the root of your server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(6066, () => {
    console.log('Server is running on port 6066');
});
