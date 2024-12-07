// routes/translationRoutes.js
const express = require("express");
const router = express.Router();
const translationService = require("../services/translationService");
const { asyncHandler, AppError } = require("../middleware/error.middleware");

// 응답 래퍼 유틸리티
const wrapResponse = (data) => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

// 유효성 검증 미들웨어
const validateTranslationRequest = (req, res, next) => {
  const { text, sourceLang, targetLang } = req.body;

  if (!text?.trim()) {
    throw new AppError("번역할 텍스트가 필요합니다", 400);
  }

  if (text.length > 5000) {
    throw new AppError("텍스트가 너무 깁니다 (최대 5000자)", 400);
  }

  if (sourceLang && !["ko", "zh"].includes(sourceLang)) {
    throw new AppError("지원하지 않는 원본 언어입니다", 400);
  }

  if (targetLang && !["ko", "zh"].includes(targetLang)) {
    throw new AppError("지원하지 않는 대상 언어입니다", 400);
  }

  next();
};

// 번역 기록 조회
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    if (page < 1) throw new AppError("페이지 번호는 1 이상이어야 합니다", 400);
    if (limit < 1 || limit > 100)
      throw new AppError("limit는 1에서 100 사이여야 합니다", 400);

    const translations = await translationService.getHistory(page, limit);
    res.json(wrapResponse(translations));
  })
);

// 번역 요청
router.post(
  "/translate",
  validateTranslationRequest,
  asyncHandler(async (req, res) => {
    const { text, sourceLang = "ko", targetLang = "zh" } = req.body;

    const result = await translationService.translate(
      text,
      sourceLang,
      targetLang
    );

    res.json(
      wrapResponse({
        translatedText: result.translatedText,
        sourceText: text,
        sourceLang,
        targetLang,
        matchScore: result.matchScore,
        qualityScore: result.qualityScore,
      })
    );
  })
);

// 번역 결과 저장
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      text,
      translatedText,
      sourceLang = "ko",
      targetLang = "zh",
    } = req.body;

    if (!text?.trim() || !translatedText?.trim()) {
      throw new AppError("원본 텍스트와 번역된 텍스트가 모두 필요합니다", 400);
    }

    const translation = await translationService.saveTranslation({
      sourceText: text,
      translatedText,
      sourceLang,
      targetLang,
    });

    res.status(201).json(wrapResponse(translation));
  })
);

// 번역 삭제
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError("유효하지 않은 ID 형식입니다", 400);
    }

    const result = await translationService.deleteTranslation(id);
    if (!result) {
      throw new AppError("삭제할 번역을 찾을 수 없습니다", 404);
    }

    res.json(wrapResponse(result));
  })
);

// 즐겨찾기 토글
router.patch(
  "/:id/favorite",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError("유효하지 않은 ID 형식입니다", 400);
    }

    const result = await translationService.toggleFavorite(id);
    if (!result) {
      throw new AppError("번역을 찾을 수 없습니다", 404);
    }

    res.json(wrapResponse(result));
  })
);

// 번역 통계 조회
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const stats = await translationService.getStats();
    res.json(wrapResponse(stats));
  })
);

// 번역 검색
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { query, page = 1, limit = 5 } = req.query;

    if (!query?.trim()) {
      throw new AppError("검색어가 필요합니다", 400);
    }

    const results = await translationService.searchTranslations(
      query,
      parseInt(page),
      parseInt(limit)
    );

    res.json(wrapResponse(results));
  })
);

module.exports = router;
