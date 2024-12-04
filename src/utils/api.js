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

  // 새로 추가: 번역 기록 저장
  addTranslation: (translationData) => {
    return fetchWrapper("/translations", {
      method: "POST",
      body: JSON.stringify(translationData),
    });
  },

  // 번역 히스토리 관련
  getTranslations: (page = 1, limit = 5) => {
    return fetchWrapper(`/translations?page=${page}&limit=${limit}`, {
      method: "GET",
    });
  },

  toggleFavorite: (id) => {
    return fetchWrapper(`/translations/${id}/favorite`, {
      method: "PATCH",
    });
  },

  // 삭제 기능 추가
  deleteTranslations: (ids) => {
    return fetchWrapper("/translations", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  },
};

export { api };
