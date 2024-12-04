// src/hooks/useTranslationHistory.js
import { useState, useEffect } from "react";
import { api } from "../utils/api";

export const useTranslationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // 번역 기록 추가 함수
  const addTranslation = async (translationData) => {
    try {
      setLoading(true);
      // API를 통해 번역 기록 저장
      await api.addTranslation(translationData);
      // 현재 페이지 새로고침
      await fetchHistory(currentPage);
      setError(null);
    } catch (err) {
      setError("번역 기록 저장 실패");
      console.error("Translation save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (page = currentPage) => {
    try {
      setLoading(true);
      const response = await api.getTranslations(page);
      setHistory(response.data);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError("히스토리 불러오기 실패");
      console.error("History fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      await api.toggleFavorite(id);
      setHistory(
        history.map((item) =>
          item._id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
    } catch (err) {
      setError("즐겨찾기 토글 실패");
      console.error("Favorite toggle error:", err);
    }
  };

  // 페이지 변경
  const handlePageChange = async (page) => {
    setCurrentPage(page);
    setSelectedIds(new Set());
    await fetchHistory(page);
  };

  // 선택 관련 함수들
  const toggleSelection = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === history.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(history.map((item) => item._id)));
    }
  };

  // 삭제 기능
  const deleteSelected = async () => {
    try {
      setLoading(true);
      await api.deleteTranslations(Array.from(selectedIds));
      setSelectedIds(new Set());
      await fetchHistory(currentPage);
    } catch (err) {
      setError("삭제 실패");
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    loading,
    error,
    currentPage,
    totalPages,
    selectedIds,
    addTranslation,
    fetchHistory,
    toggleFavorite,
    handlePageChange,
    toggleSelection,
    toggleSelectAll,
    deleteSelected,
  };
};
