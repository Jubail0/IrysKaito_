const express = require('express');
const axios = require('axios');
const app = express();
const cors = require("cors");
const PORT = 5000;
app.use(cors({
  origin: "http://localhost:5173", // 
  credentials: true
}));
app.get('/api/mindshare', async (req, res) => {
  try {
    const { timeframe } = req.query;
    const apiUrl = `https://kaito.irys.xyz/api/community-mindshare?window=${timeframe}d`;

    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    });

    // res.setHeader('Access-Control-Allow-Origin', '*');
  
    const yappersData = {
        total_yappers: response.data.community_mindshare.total_unique_yappers,
        total_tweets: response.data.community_mindshare.total_unique_tweets,
        top_engagements: response.data.community_mindshare.top_1000_yapper_community_engagements,
        top_1k_yappers: response.data.community_mindshare.top_1000_yappers
    }

    res.json(yappersData);
    

  } catch (error) {
    console.error('Axios error:', error.message);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      res.status(error.response.status).json({
        error: 'API responded with error',
        status: error.response.status,
        details: error.response.data
      });
    } else {
      res.status(500).json({ error: 'Failed to fetch from Kaito IRYS API', message: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
