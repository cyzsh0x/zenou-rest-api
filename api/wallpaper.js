const dylux = require('api-dylux');

exports.config = {
    name: 'wallpaper',
    description: 'Search for wallpapers',
    method: 'get',
    category: 'search',
    link: ['/wallpaper?query=landscape']
};

exports.initialize = async function ({ req, res }) { 
    try {
        const text1 = req.query.query;
        if (!text1) {
            return res.status(400).json({ status: 400, author: global.author, message: "[!] enter query parameter!" });
        }

        dylux.wallpaper(text1).then((data) => {
            if (!data) {
                return res.json({ error: "Wallpapers not found or failed to fetch wallpapers" });
            }
            res.status(200).json({
                status: 200,
                author: global.author,
                result: data
            });
        }).catch((err) => {
            res.sendFile(error);
        });
    } catch (error) {
        console.error("Error fetching wallpapers:", error);
        res.status(500).json({ error: "Failed to retrieve wallpapers." });
    }
};
