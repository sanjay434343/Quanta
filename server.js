    const express = require('express');
    const axios = require('axios');
    const dotenv = require('dotenv');
    const cors = require('cors');

    dotenv.config();
    const app = express();
    const PORT = process.env.PORT || 4000;

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.static('public')); 

    // Endpoint to handle requests to Gemini AI
    app.post('/ask', async (req, res) => {
        const { query } = req.body;

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    contents: [{ parts: [{ text: query }] }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Extract the text
            const answer = response.data.candidates[0]?.content?.parts[0]?.text.trim() || 'No answer received.';

            // Send only the answer back to the client
            res.json({ answer });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ answer: 'Error connecting to Gemini AI' });
        }
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
