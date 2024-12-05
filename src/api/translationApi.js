const BASE_URL = "http://localhost:3001/api/translations";

export const translationApi = {
  // 번역 히스토리 조회
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

  // 번역 수행
  translate: async (text, sourceLang, targetLang) => {
    try {
      const response = await fetch(`${BASE_URL}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text, // 백엔드에서 req.body.text로 받음
          sourceLang,
          targetLang,
        }),
      });
      if (!response.ok) throw new Error("번역에 실패했습니다.");
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // 단일 번역 삭제
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

  // 번역 저장
  saveTranslation: async (translationData) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(translationData),
      });
      if (!response.ok) throw new Error("번역 저장에 실패했습니다.");
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw error;
    }
  },

  // 즐겨찾기 토글
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
