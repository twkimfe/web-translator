// src/components/Translation/TranslationCard.js
import React, { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { useTranslationHistory } from "../../hooks/useTranslationHistory";
import TranslationHistory from "./TranslationHistory";
import { ArrowDown } from "lucide-react";
import "./TranslationCard.css";

const TranslationCard = () => {
  const [inputText, setInputText] = useState("오늘도 힘내보시죠");
  const [translatedText, setTranslatedText] = useState("");
  const { translate, translating, error: translationError } = useTranslation();
  const {
    history,
    loading: historyLoading,
    error: historyError,
    currentPage,
    handlePageChange,
    deleteSelected,
    addTranslation,
  } = useTranslationHistory();

  const handleTranslate = async () => {
    const text = inputText.trim(); // inputText에서 text 변수 추출
    if (!text) return;

    try {
      console.log("번역 요청:", text);
      const result = await translate(text); // text 전달
      console.log("번역 결과:", result);
      setTranslatedText(result);

      // 번역 결과를 히스토리에 추가
      if (result) {
        await addTranslation({
          sourceText: text,
          translatedText: result,
          sourceLang: "ko",
          targetLang: "zh",
        });
      }
    } catch (err) {
      console.error("Translation failed:", err);
    }
  };

  return (
    <div className="translation-container">
      <div className="translation-card">
        <div className="translation-grid">
          <div className="input-group">
            <label className="input-label">한국어</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="번역할 텍스트를 입력하세요"
              className="text-input"
              rows={4}
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={translating || !inputText.trim()}
            className="translate-button"
          >
            {translating ? (
              <>
                <span className="loading-spinner">◌</span>
                번역 중...
              </>
            ) : (
              <>
                <ArrowDown />
              </>
            )}
          </button>

          <div className="input-group">
            <label className="input-label">중국어</label>
            <div
              className={`result-area ${
                !translatedText ? "result-placeholder" : ""
              }`}
            >
              {translatedText ? (
                <p>{translatedText}</p>
              ) : (
                <p>번역 결과가 여기에 표시됩니다</p>
              )}
            </div>
          </div>
        </div>
        {translationError && (
          <p className="error-message">{translationError}</p>
        )}
      </div>

      <div className="translation-card">
        <h3 className="card-title">기록</h3>
        {historyLoading ? (
          <div className="loading-container">
            <div className="loading-spinner loading-text">◌</div>
          </div>
        ) : historyError ? (
          <div className="error-container">{historyError}</div>
        ) : (
          <TranslationHistory
            translations={history}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onBulkDelete={deleteSelected}
          />
        )}
      </div>
    </div>
  );
};

export default TranslationCard;
