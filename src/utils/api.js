// src/utils/api.js

const BASE_URL = "https://translation.googleapis.com/language/translate/v2";

// 기본 fetch 래퍼
const fetchWrapper = async (endpoint, options = {}) => {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const url = `${endpoint}?key=${apiKey}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// 번역 API 전용 함수
const translateAPI = {
  translate: (text, sourceLang = "ko", targetLang = "zh") => {
    return fetchWrapper(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
      }),
    });
  },
};

export { fetchWrapper, translateAPI };
