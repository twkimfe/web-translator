// server/services/translationService.js
const fetch = require("node-fetch");

const MYMEMORY_API_BASE = "https://api.mymemory.translated.net/get";
const EMAIL = process.env.MYMEMORY_EMAIL;

class TranslationService {
  constructor() {
    this.baseUrl = MYMEMORY_API_BASE;
  }

  async translate(text, sourceLang = "ko", targetLang = "zh") {
    try {
      const url = new URL(this.baseUrl);
      url.searchParams.append("q", text);
      url.searchParams.append("langpair", `${sourceLang}|${targetLang}`);

      if (EMAIL) {
        url.searchParams.append("de", EMAIL);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();

      if (data.responseStatus !== 200) {
        throw new Error(
          data.responseDetails || "번역 처리 중 오류가 발생했습니다."
        );
      }

      return {
        translatedText: data.responseData.translatedText,
        match: data.responseData.match,
        quotaRemaining: data.responseData.quotaRemaining,
      };
    } catch (error) {
      console.error("Translation Error:", error);
      throw new Error("번역 처리 중 오류가 발생했습니다: " + error.message);
    }
  }

  async checkTranslationQuality(text, translatedText, sourceLang, targetLang) {
    try {
      const backTranslation = await this.translate(
        translatedText,
        targetLang,
        sourceLang
      );
      const similarityScore = this.calculateSimilarity(
        text,
        backTranslation.translatedText
      );

      return {
        qualityScore: similarityScore,
        backTranslation: backTranslation.translatedText,
      };
    } catch (error) {
      console.warn("Quality check failed:", error);
      return { qualityScore: null, backTranslation: null };
    }
  }

  calculateSimilarity(str1, str2) {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0;

    const distance = this.levenshteinDistance(str1, str2);
    return 1 - distance / maxLength;
  }

  levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j - 1] + 1,
            dp[i - 1][j] + 1,
            dp[i][j - 1] + 1
          );
        }
      }
    }

    return dp[m][n];
  }
}

module.exports = new TranslationService();
