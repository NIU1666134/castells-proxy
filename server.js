const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();
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

// PROXY OPTIMITZAT AMB FILTRES
app.get('/api/actuacions', async (req, res) => {
  try {
    const { year, colla, tipusCastell, resultat } = req.query;

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

    // Mapear només camps essencials
    let results = data.results.map(r => ({
      date: r.date,
      colla: r.colla?.name,
      castell_type: r.castell_type?.name,
      castell_result: r.castell_result?.name,
      place: r.show?.place,
      latitude: r.show?.latitude,
      longitude: r.show?.longitude
    }));

    // Aplicar filtres al backend si venen
    if (year) results = results.filter(r => r.date && new Date(r.date).getFullYear() == year);
    if (colla) results = results.filter(r => r.colla === colla);
    if (tipusCastell) results = results.filter(r => r.castell_type === tipusCastell);
    if (resultat) results = results.filter(r => r.castell_result === resultat);

    res.json({ results });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true });
  }
});

app.listen(PORT, () => console.log(`Proxy escoltant al port ${PORT}`));

