const axios = require('axios');

exports.config = {
  name: "manga",
  description: "Retrieve manga chapter images",
  method: "get",
  category: "anime",
  link: ["/manga?name=Solo Leveling&chapter=1-5"]
};

exports.initialize = async function ({ req, res }) {
  const { name, chapter } = req.query;
  
  if (!name || !chapter) {
    return res.status(400).json({
      error: "Missing required parameters"
    });
  }
  
  try {
    const url = `https://weebverse.onrender.com/manga?name=${encodeURIComponent(name)}&chapters=${encodeURIComponent(chapter)}`;
    const response = await axios.get(url);
    
    const processedData = response.data.chapters.map(chapter => ({
      chapter: chapter.chapter,
      imageCount: chapter.images.length,
      images: chapter.images
    }));
    
    return res.status(200).json({
      manga: response.data.manga,
      source: response.data.source,
      quality: response.data.quality,
      chapters: processedData
    });
  } catch (error) {
    console.error('Error fetching manga data:', error);
    if (error.response) {
      return res.status(error.response.status).json({
        error: "Error fetching manga data",
        message: error.message
      });
    } else if (error.request) {
      return res.status(503).json({
        error: "Service unavailable",
        message: "No response received from the manga server"
      });
    } else {
      return res.status(500).json({
        error: "Internal server error",
        message: "An unexpected error occurred"
      });
    }
  }
};