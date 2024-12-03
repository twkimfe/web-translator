// server/index.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang = "ko", targetLang = "zh" } = req.body;

    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: `${sourceLang}|${targetLang}`,
        },
      }
    );

    if (response.data.responseStatus !== 200) {
      throw new Error(response.data.responseDetails || "Translation failed");
    }

    res.json({
      data: {
        translations: [
          {
            translatedText: response.data.responseData.translatedText,
          },
        ],
      },
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({
      error: "Translation failed",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
