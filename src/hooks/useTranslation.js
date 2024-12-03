// src/hooks/useTranslation.js

import { useState, useCallback } from "react";
import { translateAPI } from "../utils/api";

const useTranslation = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 번역 텍스트 입력 핸들러
  const handleTextChange = useCallback((newText) => {
    setText(newText);
    setError(null);
  }, []);

  // 번역 실행 함수
  const translate = useCallback(async () => {
    if (!text.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await translateAPI.translate(text);
      const result = response.data.translations[0].translatedText;
      setTranslatedText(result);
    } catch (err) {
      setError("번역 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("Translation error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [text]);

  // 상태 초기화
  const reset = useCallback(() => {
    setText("");
    setTranslatedText("");
    setError(null);
  }, []);

  return {
    text,
    translatedText,
    isLoading,
    error,
    handleTextChange,
    translate,
    reset,
  };
};

export default useTranslation;
