const axios = require("axios");

exports.config = {
    name: 'tikdl',
    description: 'Downloads TikTok videos using TikWM API.',
    category: 'downloader',
    link: ['/tikdl?url='],
    method: 'get'
};

exports.initialize = async function ({ req, res }) {
    try {
        const videoUrl = req.query.url;

        if (!videoUrl) {
            return res.status(400).json({ error: "Please add ?url=video_url_here" });
        }

        const apiUrl = `https://tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.data) {
            res.json({ status: response.data.code, author: global.author, data: response.data.data });
        } else {
            res.status(400).json({ error: "Failed to download video. Please check the URL and try again." });
        }
    } catch (error) {
        console.error("Error downloading TikTok video:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
};