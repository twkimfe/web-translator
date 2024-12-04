// server/config/database.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/translation-app", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB 연결 성공");
  } catch (error) {
    console.error("MongoDB 연결 실패:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

// server/index.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const translationRoutes = require("./routes/translationRoutes");

const app = express();

// 데이터베이스 연결
connectDB();

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.use("/api", translationRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행중입니다`);
});

// server/models/Translation.js
const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  sourceText: {
    type: String,
    required: true,
    trim: true,
  },
  targetText: {
    type: String,
    required: true,
    trim: true,
  },
  sourceLanguage: {
    type: String,
    default: "ko",
  },
  targetLanguage: {
    type: String,
    default: "zh",
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Translation", translationSchema);

// server/routes/translationRoutes.js
const express = require("express");
const router = express.Router();
const Translation = require("../models/Translation");

// 번역 기록 저장
router.post("/translations", async (req, res) => {
  try {
    const translation = new Translation(req.body);
    await translation.save();
    res.status(201).json(translation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 번역 기록 조회
router.get("/translations", async (req, res) => {
  try {
    const translations = await Translation.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 즐겨찾기 토글
router.patch("/translations/:id/favorite", async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id);
    if (!translation) {
      return res.status(404).json({ error: "번역을 찾을 수 없습니다" });
    }
    translation.isFavorite = !translation.isFavorite;
    await translation.save();
    res.json(translation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
