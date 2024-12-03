// src/utils/api.js

const BASE_URL = "http://localhost:3001/api";

// 기본 fetch 래퍼
const fetchWrapper = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
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

// 번역 API 전용 함수
const translateAPI = {
  translate: (text, sourceLang = "ko", targetLang = "zh") => {
    return fetchWrapper(`${BASE_URL}/translate`, {
      method: "POST",
      body: JSON.stringify({
        text,
        sourceLang,
        targetLang,
      }),
    });
  },
};

export { fetchWrapper, translateAPI };
