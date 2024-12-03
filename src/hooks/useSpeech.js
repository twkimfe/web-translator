// src/hooks/useSpeech.js

import { useState, useEffect, useCallback, useRef } from "react";

const useSpeech = (language = "ko-KR") => {
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognition = useRef(null);

  // Speech Recognition 초기화
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setSpeechError("이 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }

    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;
    recognition.current.lang = language;

    recognition.current.onend = () => {
      setIsListening(false);
    };

    recognition.current.onerror = (event) => {
      setIsListening(false);
      setSpeechError("음성 인식 중 오류가 발생했습니다.");
      console.error("Speech recognition error:", event.error);
    };

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [language]);

  // 음성 인식 시작
  const startListening = useCallback((onResult) => {
    if (!recognition.current) {
      setSpeechError("음성 인식이 초기화되지 않았습니다.");
      return;
    }

    setSpeechError(null);
    setIsListening(true);

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    try {
      recognition.current.start();
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setSpeechError("음성 인식을 시작할 수 없습니다.");
      setIsListening(false);
    }
  }, []);

  // 음성 인식 중지
  const stopListening = useCallback(() => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  }, []);

  // 텍스트를 음성으로 변환 (TTS)
  const speak = useCallback((text, lang) => {
    if (!("speechSynthesis" in window)) {
      setSpeechError("이 브라우저는 음성 합성을 지원하지 않습니다.");
      return;
    }

    // 이전 음성 합성이 진행 중이라면 중지
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // 에러 처리
    utterance.onerror = (event) => {
      setSpeechError("음성 합성 중 오류가 발생했습니다.");
      console.error("Speech synthesis error:", event);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  return {
    isListening,
    speechError,
    startListening,
    stopListening,
    speak,
  };
};

export default useSpeech;
