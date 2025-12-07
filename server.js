const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();  // carreguem .env
const app = express();
const PORT = process.env.PORT || 3000;

// CORS OBERT
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});  

// PROXY
app.get('/api/actuacions', async (req, res) => {
  try {
    const params = new URLSearchParams({
      api_token_id: process.env.API_TOKEN_ID,
      api_token_key: process.env.API_TOKEN_KEY,
      date_start: '2024-01-01',
      date_end: '2030-01-01',
      json: 'true'
    });

    const apiUrl = `https://castellscat.cat/api/actuacions?${params.toString()}`;

    const response = await fetch(apiUrl);

    if (!response.ok) return res.status(response.status).json({ error: true });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: true });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy escoltant al port ${PORT}`);
});
