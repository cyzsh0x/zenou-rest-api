const axios = require('axios');
const cheerio = require('cheerio');

exports.config = {
    name: 'ringtone',
    description: 'Search for ringtones on Meloboom.',
    method: 'get',
    category: 'search',
    link: ['/ringtone?title=']
};

function ringtone(title) {
    return new Promise((resolve, reject) => {
        axios.get('https://meloboom.com/en/search/' + encodeURIComponent(title))
            .then((get) => {
                let $ = cheerio.load(get.data);
                let results = [];
                $('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (index, element) {
                    results.push({
                        title: $(element).find('h4').text(),
                        source: 'https://meloboom.com/' + $(element).find('a').attr('href'),
                        audio: $(element).find('audio').attr('src')
                    });
                });
                resolve(results);
            })
            .catch(reject);
    });
}

exports.initialize = async function ({ req, res }) {
    try {
        const title = req.query.title;

        if (!title) {
            return res.status(400).json({
                status: 400,
                author: global.author,
                message: "Please provide a title for the ringtone search."
            });
        }

        const results = await ringtone(title);
        return res.status(200).json({
            status: 200,
            author: global.author,
            results: results
        });
    } catch (error) {
        console.error("Error processing ringtone request:", error);
        return res.status(500).json({
            status: 500,
            author: global.author,
            message: "An error occurred while processing the request."
        });
    }
};