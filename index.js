import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//gemini setup 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash'
});


//route to /api/chat
app.post('/api/chat', async (req, res) => {

    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const content = response.text();

        res.json({ message: content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});