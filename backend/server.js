// // backend/server.js
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// const PORT = 5000;

// app.use(cors());

// app.get("/api/upcoming-matches", async (req, res) => {
//   try {
//     const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

//     const response = await axios.get(
//       "https://v3.football.api-sports.io/fixtures",
//       {
//         headers: {
//           "x-apisports-key": process.env.API_KEY,
//         },
//         params: {
//           date: today,
//         },
//       }
//     );

//     // Simplified data
//     const matches = response.data.response.map((match) => ({
//       date: match.fixture.date,
//       homeTeam: match.teams.home.name,
//       awayTeam: match.teams.away.name,
//       homeLogo: match.teams.home.logo,
//       awayLogo: match.teams.away.logo,
//     }));

//     res.json(matches);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Failed to fetch matches" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// backend/server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/upcoming-matches", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    const response = await axios.get(
      "https://v3.football.api-sports.io/fixtures",
      {
        headers: {
          "x-apisports-key": process.env.API_KEY,
        },
        params: {
          date: today,
        },
      }
    );

    // Cleaned up match data
    const allMatches = response.data.response.map((match) => ({
      date: match.fixture.date,
      homeTeam: match.teams.home.name,
      awayTeam: match.teams.away.name,
      homeLogo: match.teams.home.logo,
      awayLogo: match.teams.away.logo,
    }));

    // 🧠 Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedMatches = allMatches.slice(startIndex, endIndex);

    res.json({
      page,
      limit,
      total: allMatches.length,
      totalPages: Math.ceil(allMatches.length / limit),
      data: paginatedMatches,
    });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
