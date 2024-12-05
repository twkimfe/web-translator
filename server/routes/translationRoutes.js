const express = require("express");
const router = express.Router();
const Translation = require("../models/Translation");

// 상수 정의
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_SOURCE_LANG = "ko";
const DEFAULT_TARGET_LANG = "zh";

// 공통 에러 처리 함수
const handleError = (res, error, statusCode = 500) => {
  console.error("Translation API Error:", error);
  res.status(statusCode).json({
    error: error.message,
    status: "error",
  });
};

// GET /api/translations
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1); // 최소값 1 보장
    const limit = Math.max(1, parseInt(req.query.limit) || DEFAULT_PAGE_SIZE);
    const skip = (page - 1) * limit;
    const [total, translations] = await Promise.all([
      Translation.countDocuments(),
      Translation.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(), // 성능 최적화
    ]);
    res.json({
      status: "success",
      data: {
        translations,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          pageSize: limit,
        },
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/translations/translate
router.post("/translate", async (req, res) => {
  console.log("번역 요청 받음:", req.body); // 요청 로깅
  try {
    const { text, sourceLang, targetLang } = req.body;

    // 여기에 실제 번역 로직 구현
    const translatedText = text; // 임시로 원본 텍스트를 반환

    // 번역 결과 저장
    const translation = new Translation({
      sourceText: text,
      translatedText,
      sourceLang: sourceLang || DEFAULT_SOURCE_LANG,
      targetLang: targetLang || DEFAULT_TARGET_LANG,
    });

    await translation.save();

    res.json({
      status: "success",
      data: {
        translatedText,
      },
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// DELETE /api/translations/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await Translation.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({
        error: "번역 기록을 찾을 수 없습니다",
        status: "error",
      });
    }
    res.json({
      status: "success",
      data: {
        message: "번역 기록이 삭제되었습니다.",
        deletedId: req.params.id,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

// 번역 기록 저장
router.post("/translate", async (req, res) => {
  console.log("번역 요청 받음:", req.body); // 디버깅용 로그 추가
  try {
    const { sourceText, translatedText, sourceLang, targetLang } = req.body;
    // 필수 필드 검증
    if (!sourceText || !translatedText) {
      return res.status(400).json({
        error: "원문과 번역문은 필수 입력 항목입니다.",
        status: "error",
      });
    }
    const translation = new Translation({
      sourceText,
      translatedText,
      sourceLang: sourceLang || DEFAULT_SOURCE_LANG,
      targetLang: targetLang || DEFAULT_TARGET_LANG,
    });
    await translation.save();

    res.json({
      status: "success",
      data: {
        translatedText,
      },
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// 즐겨찾기 토글
router.patch("/:id/favorite", async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id);
    if (!translation) {
      return res.status(404).json({
        error: "번역 기록을 찾을 수 없습니다",
        status: "error",
      });
    }
    translation.isFavorite = !translation.isFavorite;
    await translation.save();
    res.json({
      status: "success",
      data: translation,
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

module.exports = router;
