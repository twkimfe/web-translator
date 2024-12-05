import React from "react";
import "./TranslationHistory.css";

const TranslationHistory = ({
  translations = [], // 기본값으로 빈 배열 설정
  currentPage = 1,
  onPageChange = () => {},
  onBulkDelete = () => {},
  loading = false,
}) => {
  // translations가 배열인지 확인하고, 배열이 아니면 빈 배열 사용
  const translationArray = Array.isArray(translations) ? translations : [];

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      {translationArray.length === 0 ? (
        <div className="empty-state">번역 기록이 없습니다.</div>
      ) : (
        <>
          <div className="history-list" role="list">
            {translationArray.map((item) => (
              <div key={item._id} className="history-item" role="listitem">
                <div className="history-content">
                  <div className="history-text">
                    <p className="source-text" lang={item.sourceLang}>
                      {item.sourceText}
                    </p>
                    <p className="translated-text" lang={item.targetLang}>
                      {item.translatedText}
                    </p>
                  </div>
                  <div className="history-meta">
                    <span className="timestamp">
                      {formatTimestamp(item.createdAt)}
                    </span>
                    <button
                      className="delete-button"
                      onClick={() => onBulkDelete([item._id])}
                      aria-label={`${item.sourceText} 번역 기록 삭제`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {translationArray.length > 0 && (
            <div
              className="pagination"
              role="navigation"
              aria-label="페이지 탐색"
            >
              <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="이전 페이지"
              >
                이전
              </button>
              <span className="page-info" aria-current="page">
                {currentPage}
              </span>
              <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={translationArray.length < 5}
                aria-label="다음 페이지"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TranslationHistory;
