// src/components/Translation/TranslationCard.js
import React, { useState } from "react";
import { Card } from "../ui/card";
import { useTranslation } from "../../hooks/useTranslation";
import { useTranslationHistory } from "../../hooks/useTranslationHistory";
import { Star, StarOff } from "lucide-react";

const TranslationCard = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const { translate, translating, error: translationError } = useTranslation();
  const {
    history,
    loading: historyLoading,
    error: historyError,
    toggleFavorite,
  } = useTranslationHistory();

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    try {
      const result = await translate(inputText);
      setTranslatedText(result);
    } catch (err) {
      console.error("Translation failed:", err);
    }
  };

  const handleFavoriteToggle = async (id) => {
    await toggleFavorite(id);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="번역할 텍스트를 입력하세요"
            className="w-full p-2 border rounded-md"
            rows={4}
          />
          <button
            onClick={handleTranslate}
            disabled={translating}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {translating ? "번역 중..." : "번역하기"}
          </button>

          {translationError && (
            <p className="text-red-500">{translationError}</p>
          )}

          {translatedText && (
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="font-medium">{translatedText}</p>
            </div>
          )}
        </div>
      </Card>

      {/* 번역 히스토리 섹션 */}
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">번역 히스토리</h2>
        {historyLoading ? (
          <p>로딩 중...</p>
        ) : historyError ? (
          <p className="text-red-500">{historyError}</p>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-start p-2 border-b"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{item.sourceText}</p>
                  <p className="font-medium">{item.translatedText}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleFavoriteToggle(item._id)}
                  className="ml-2 p-1 hover:bg-gray-100 rounded"
                >
                  {item.isFavorite ? (
                    <Star className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <StarOff className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

// default export로 변경
export default TranslationCard;
