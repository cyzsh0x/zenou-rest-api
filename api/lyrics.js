const dylux = require('api-dylux');

exports.config = {
    name: 'lyrics',
    description: 'Fetch song lyrics',
    method: 'get',
    category: 'search',
    link: ['/lyrics?query=until i found you']
};

exports.initialize = async function ({ req, res }) { 
    try {
        const text1 = req.query.query;
        if (!text1) {
            return res.status(400).json({ status: 400, author: global.author, message: "[!] enter query parameter!" });
        }

        dylux.lyrics(text1).then((data) => {
            if (!data) {
                return res.status(404).json({ status: 404, author: global.author, message: "Lyrics not found." });
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
        console.error("Error fetching lyrics:", error);
        res.status(500).json({ 
            status: 200,
            error: "Failed to retrieve lyrics." });
    }
};
