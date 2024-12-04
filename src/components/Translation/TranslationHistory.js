const TranslationHistory = ({
  translations = [], // 기본값 설정
  currentPage = 1,
  onPageChange = () => {},
  onBulkDelete = () => {},
}) => {
  const itemsPerPage = 5; // 페이지당 항목 수 정의
  const totalPages = Math.ceil(translations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTranslations = translations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="history-container">
      <div className="history-list">
        {displayedTranslations.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-content">
              <div className="history-text">
                <p className="source-text">{item.sourceText}</p>
                <p className="translated-text">{item.translatedText}</p>
              </div>
              <div className="history-meta">
                <span className="timestamp">{item.timestamp}</span>
                <button
                  className="delete-button"
                  onClick={() => onBulkDelete([item.id])}
                  aria-label="삭제"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default TranslationHistory;
