// src/hooks/useTranslation.js
import { useState } from "react";
import { api } from "../utils/api";

export const useTranslation = () => {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);

  const translate = async (text, sourceLang = "ko", targetLang = "zh") => {
    try {
      setTranslating(true);
      setError(null);

      const response = await api.translate(text, sourceLang, targetLang);
      return response.data.translations[0].translatedText;
    } catch (err) {
      setError("번역 실패");
      console.error("Translation error:", err);
      throw err;
    } finally {
      setTranslating(false);
    }
  };

  return {
    translate,
    translating,
    error,
  };
};
