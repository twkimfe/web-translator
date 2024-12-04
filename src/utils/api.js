// src/utils/api.js
const BASE_URL = "http://localhost:3001/api";

// 기본 fetch 래퍼
const fetchWrapper = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.details || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// API 함수들
const api = {
  // 번역 관련
  translate: (text, sourceLang = "ko", targetLang = "zh") => {
    return fetchWrapper("/translate", {
      method: "POST",
      body: JSON.stringify({
        text,
        sourceLang,
        targetLang,
      }),
    });
  },

  // 번역 히스토리 관련
  getTranslations: () => {
    return fetchWrapper("/translations", {
      method: "GET",
    });
  },

  toggleFavorite: (id) => {
    return fetchWrapper(`/translations/${id}/favorite`, {
      method: "PATCH",
    });
  },
};

export { api };
