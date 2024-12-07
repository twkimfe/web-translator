const Translation = require("../models/Translation");
const { AppError } = require("../middleware/error.middleware");

// 하이라이트: 추가된 유효성 검증 함수들
const validateLanguage = (lang) => {
  const supportedLanguages = ["ko", "zh"];
  if (!supportedLanguages.includes(lang)) {
    throw new AppError(`지원하지 않는 언어입니다: ${lang}`, 400);
  }
};

const validateTranslationData = (data) => {
  const { sourceText, translatedText, sourceLang, targetLang } = data;

  if (!sourceText?.trim()) {
    throw new AppError("원본 텍스트가 필요합니다", 400);
  }

  if (!translatedText?.trim()) {
    throw new AppError("번역된 텍스트가 필요합니다", 400);
  }

  validateLanguage(sourceLang);
  validateLanguage(targetLang);

  if (sourceLang === targetLang) {
    throw new AppError("원본 언어와 대상 언어가 같을 수 없습니다", 400);
  }
};

class TranslationService {
  async getHistory(page = 1, limit = 5) {
    const skip = (page - 1) * limit;

    // 하이라이트: 페이지네이션 유효성 검사 추가
    if (page < 1 || limit < 1) {
      throw new AppError("유효하지 않은 페이지네이션 값입니다", 400);
    }

    const [translations, total] = await Promise.all([
      Translation.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Translation.countDocuments(),
    ]);

    return {
      translations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async translate(text, sourceLang, targetLang) {
    // 하이라이트: 번역 요청 유효성 검사 추가
    if (!text?.trim()) {
      throw new AppError("번역할 텍스트가 필요합니다", 400);
    }

    validateLanguage(sourceLang);
    validateLanguage(targetLang);

    // 실제 번역 API 호출 로직 구현
    const translatedText = `[번역된 텍스트]: ${text}`; // 임시 구현

    // 하이라이트: 번역 결과 검증 추가
    const result = {
      translatedText,
      sourceLang,
      targetLang,
      matchScore: 0.95, // 임시 값
      qualityScore: 0.92, // 임시 값
    };

    if (!result.translatedText) {
      throw new AppError("번역 결과가 유효하지 않습니다", 500);
    }

    return result;
  }

  async saveTranslation(data) {
    // 하이라이트: 저장 전 데이터 유효성 검증
    validateTranslationData(data);

    const translation = new Translation({
      sourceText: data.sourceText,
      translatedText: data.translatedText,
      sourceLang: data.sourceLang,
      targetLang: data.targetLang,
      matchScore: data.matchScore || null,
      qualityScore: data.qualityScore || null,
    });

    try {
      await translation.save();
      return translation;
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("동일한 번역이 이미 존재합니다", 400);
      }
      throw error;
    }
  }

  async deleteTranslation(id) {
    // 하이라이트: ID 형식 검증 추가
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError("유효하지 않은 ID 형식입니다", 400);
    }

    const translation = await Translation.findByIdAndDelete(id);
    if (!translation) {
      throw new AppError("삭제할 번역을 찾을 수 없습니다", 404);
    }
    return translation;
  }

  async toggleFavorite(id) {
    // 하이라이트: ID 형식 검증 추가
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError("유효하지 않은 ID 형식입니다", 400);
    }

    const translation = await Translation.findById(id);
    if (!translation) {
      throw new AppError("번역을 찾을 수 없습니다", 404);
    }

    translation.isFavorite = !translation.isFavorite;
    await translation.save();
    return translation;
  }

  // 하이라이트: 새로운 유틸리티 메서드 추가
  async getStats() {
    const stats = await Translation.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          averageQualityScore: { $avg: "$qualityScore" },
          favoriteCount: {
            $sum: { $cond: [{ $eq: ["$isFavorite", true] }, 1, 0] },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalCount: 0,
        averageQualityScore: 0,
        favoriteCount: 0,
      }
    );
  }

  // 하이라이트: 검색 기능 추가
  async searchTranslations(query, page = 1, limit = 5) {
    if (!query?.trim()) {
      throw new AppError("검색어가 필요합니다", 400);
    }

    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(query, "i");

    const [translations, total] = await Promise.all([
      Translation.find({
        $or: [{ sourceText: searchRegex }, { translatedText: searchRegex }],
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Translation.countDocuments({
        $or: [{ sourceText: searchRegex }, { translatedText: searchRegex }],
      }),
    ]);

    return {
      translations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new TranslationService();
