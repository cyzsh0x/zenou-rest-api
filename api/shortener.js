const axios = require('axios');

exports.config = {
    name: 'akuari-shorten',
    description: 'Shorten URLs using Akuari Shorten API',
    method: 'get',
    category: 'tools',
    link: ['/akuari-shorten?url=']
};

exports.initialize = async function ({ req, res }) {
    try {
        const url = req.query.url; 

        if (!url) {
            return res.status(400).json({
                status: 400,
                admin: global.admin,
                message: "[!] Please provide a 'url' query parameter!"
            });
        }

        const customId = Math.random().toString(36).substring(2, 10);

        const apiUrl = `https://s.akuari.my.id/shorten?url=${encodeURIComponent(url)}&customid=${customId}`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || !data.shortenedUrl) {
            return res.status(422).json({
                status: 422,
                author: global.author,
                message: "Failed to shorten the URL. Please try again later."
            });
        }

        res.status(200).json({
            status: 200,
            author: global.author,
            result: data.shortenedUrl
        });
    } catch (error) {
        console.error("Error shortening URL:", error);
        res.status(500).json({
            status: 500,
            author: global.author,
            message: "An error occurred while shortening the URL."
        });
    }
};