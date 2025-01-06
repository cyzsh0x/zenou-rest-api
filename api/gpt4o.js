const axios = require("axios");

const AVAILABLE_MODELS = ["llama-3-70b", "llama-3-405b", "gpt-3.5-turbo", "gpt-4o"];

const extractData = input => {
  return input
    .split("\n")
    .filter(line => line.startsWith("data: "))
    .map(line => {
      try {
        const json = JSON.parse(line.substring(6).trim());
        if (json.event === "stream-end") {
          return "";
        }
        if (json.event === "final-response") {
          return json.data.message || "";
        }
        return "";
      } catch {
        return "";
      }
    })
    .join("")
    .trim();
};

exports.config = {
    name: 'GPT-4o',
    description: 'Interact with GPT-4o',
    method: 'get',
    category: 'ai',
    link: ['/GPT-4o?ask=hi']
};

exports.initialize = async function ({ req, res }) {
    const { ask, model } = req.query;
    
if (!ask) {
        return res.status(400).json({
            status: 400, 
            error: 'The "ask" parameter is required.' });
    }

    if (!model || !AVAILABLE_MODELS.includes(model)) {
        return res.status(400).json({ 
            status: 400,
            error: 'Invalid or missing model parameter. Available models are:', 
            availableModels: AVAILABLE_MODELS 
        });
    }

    try {
        const response = await axios.post(
            "https://darkai.foundation/chat",
            {
                query: ask,
                model: model || 'gpt-4o'
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0"
                }
            }
        );

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = extractData(response.data);
        res.status(200).json({
            status: 200,
            author: global.author,
            results: result
       });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            status: 500,
            error: 'Internal Server Error' 
       });
    }
};