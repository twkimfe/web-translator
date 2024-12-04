const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// MongoDB 연결
mongoose
  .connect("mongodb://localhost:27017/translation-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.error("MongoDB 연결 실패:", err));

// Translation 모델 정의
const translationSchema = new mongoose.Schema({
  sourceText: { type: String, required: true },
  translatedText: { type: String, required: true },
  sourceLang: { type: String, default: "ko" },
  targetLang: { type: String, default: "zh" },
  isFavorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Translation = mongoose.model("Translation", translationSchema);

// 미들웨어
app.use(cors());
app.use(express.json());

// 번역 API 엔드포인트
app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang = "ko", targetLang = "zh" } = req.body;

    // MyMemory API로 번역
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

    // 번역 결과 저장
    const translation = new Translation({
      sourceText: text,
      translatedText: response.data.responseData.translatedText,
      sourceLang,
      targetLang,
    });

    await translation.save();

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

// 번역 히스토리 조회 API
app.get("/api/translations", async (req, res) => {
  try {
    const translations = await Translation.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(translations);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch translations",
      details: error.message,
    });
  }
});

// 즐겨찾기 토글 API
app.patch("/api/translations/:id/favorite", async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id);
    if (!translation) {
      return res.status(404).json({ error: "Translation not found" });
    }

    translation.isFavorite = !translation.isFavorite;
    await translation.save();

    res.json(translation);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update favorite status",
      details: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
