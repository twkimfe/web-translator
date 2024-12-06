const express = require("express");
const router = express.Router();
const Translation = require("../models/Translation");
const translationService = require("../services/translationService");

// 상수 정의
const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_SOURCE_LANG = "ko";
const DEFAULT_TARGET_LANG = "zh";

// 응답 헬퍼 함수들
const sendResponse = (res, data, status = 200) => {
  res.status(status).json({
    status: "success",
    data,
  });
};

const handleError = (res, error, statusCode = 500) => {
  console.error("Translation Error:", error);
  res.status(statusCode).json({
    success: false,
    message: error.message || "번역 중 오류가 발생했습니다.",
  });
};

// GET /api/translations - 번역 기록 조회
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || DEFAULT_PAGE_SIZE);
    const skip = (page - 1) * limit;

    const [total, translations] = await Promise.all([
      Translation.countDocuments(),
      Translation.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    sendResponse(res, {
      translations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

// POST /api/translations/translate - 번역 수행 및 저장
router.post("/translate", async (req, res) => {
  console.log("번역 요청 받음:", req.body);
  try {
    const { text, sourceLang, targetLang } = req.body;

    if (!text) {
      return handleError(res, new Error("번역할 텍스트가 필요합니다."), 400);
    }

    // 번역 서비스를 통한 번역 수행
    const translation = await translationService.translate(
      text,
      sourceLang || DEFAULT_SOURCE_LANG,
      targetLang || DEFAULT_TARGET_LANG
    );

    // 품질 체크
    const qualityCheck = await translationService.checkTranslationQuality(
      text,
      translation.translatedText,
      sourceLang || DEFAULT_SOURCE_LANG,
      targetLang || DEFAULT_TARGET_LANG
    );

    // DB에 저장
    const translationDoc = new Translation({
      sourceText: text,
      translatedText: translation.translatedText,
      sourceLang: sourceLang || DEFAULT_SOURCE_LANG,
      targetLang: targetLang || DEFAULT_TARGET_LANG,
      matchScore: translation.match,
      qualityScore: qualityCheck.qualityScore,
      createdAt: new Date(),
    });

    await translationDoc.save();

    sendResponse(res, {
      translation: translationDoc,
      translatedText: translation.translatedText,
      qualityCheck,
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// DELETE /api/translations - 여러 번역 기록 삭제
router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return handleError(
        res,
        new Error("삭제할 번역 기록 ID를 입력해주세요."),
        400
      );
    }

    const result = await Translation.deleteMany({ _id: { $in: ids } });

    sendResponse(res, {
      message: `${result.deletedCount}개의 번역 기록이 삭제되었습니다.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE /api/translations/:id - 단일 번역 기록 삭제
router.delete("/:id", async (req, res) => {
  try {
    const result = await Translation.findByIdAndDelete(req.params.id);

    if (!result) {
      return handleError(res, new Error("번역 기록을 찾을 수 없습니다"), 404);
    }

    sendResponse(res, {
      message: "번역 기록이 삭제되었습니다.",
      deletedId: req.params.id,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// PATCH /api/translations/:id/favorite - 즐겨찾기 토글
router.patch("/:id/favorite", async (req, res) => {
  try {
    const translation = await Translation.findById(req.params.id);

    if (!translation) {
      return handleError(res, new Error("번역 기록을 찾을 수 없습니다"), 404);
    }

    translation.isFavorite = !translation.isFavorite;
    await translation.save();

    sendResponse(res, translation);
  } catch (error) {
    handleError(res, error, 400);
  }
});

module.exports = router;
