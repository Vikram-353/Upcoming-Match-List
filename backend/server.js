// backend/server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const api_url = process.env.FOOTBALL_API;

app.use(cors());

app.get("/api/upcoming-matches", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    const response = await axios.get(api_url, {
      headers: {
        "x-apisports-key": process.env.API_KEY,
      },
      params: {
        date: today,
      },
    });

    // Simplified data
    const matches = response.data.response.map((match) => ({
      date: match.fixture.date,
      homeTeam: match.teams.home.name,
      awayTeam: match.teams.away.name,
      homeLogo: match.teams.home.logo,
      awayLogo: match.teams.away.logo,
    }));

    res.json(matches);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
