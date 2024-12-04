// src/hooks/useTranslationHistory.js
import { useState, useEffect } from "react";
import { api } from "../utils/api";

export const useTranslationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getTranslations();
      setHistory(data);
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

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    loading,
    error,
    fetchHistory,
    toggleFavorite,
  };
};
