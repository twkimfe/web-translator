// src/utils/api.js
const BASE_URL = "/api/translations"; // 프록시 사용을 위해 변경

export const api = {
  getTranslations: async (page = 1, limit = 5) => {
    try {
      const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error("번역 기록을 불러오는데 실패했습니다.");
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  translate: async (text, sourceLang = "ko", targetLang = "zh") => {
    if (!text?.trim()) {
      throw new Error("번역할 텍스트가 필요합니다");
    }

    try {
      const response = await fetch(`${BASE_URL}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "번역에 실패했습니다.");
      }

      const data = await response.json();
      console.log("서버 응답:", data);
      // data.data.translatedText 구조 확인
      return data.data.translatedText; // 서버 응답 구조에 맞게 수정
    } catch (error) {
      console.error("Translation API Error:", error);
      throw error;
    }
  },

  addTranslation: async (translationData) => {
    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: translationData.sourceText, // sourceText -> text로 변경
          translatedText: translationData.translatedText,
          sourceLang: translationData.sourceLang,
          targetLang: translationData.targetLang,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "번역 저장에 실패했습니다.");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTranslation: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("번역 삭제에 실패했습니다.");
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  toggleFavorite: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}/favorite`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("즐겨찾기 설정에 실패했습니다.");
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  },
};
