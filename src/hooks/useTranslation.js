// src/hooks/useTranslation.js
import { useState } from "react";
import { api } from "../utils/api";

export const useTranslation = () => {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);

  const translate = async (text) => {
    if (!text) {
      throw new Error("번역할 텍스트가 필요합니다");
    }

    try {
      const response = await api.translate(text);
      return response;
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
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
