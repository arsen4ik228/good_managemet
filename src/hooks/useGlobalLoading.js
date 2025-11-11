import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";

export const useGlobalLoading = (delay = 1000) => {
  const location = useLocation();

  // ✅ Проверяем, находимся ли мы в диалоге
  const isDialogRoute =
    matchPath("/:organizationId/chat/:contactId/:convertId", location.pathname) ||
    matchPath("/chat/:contactId/:convertId", location.pathname) ||
    matchPath("/:organizationId/chat/:contactId", location.pathname) ||
    matchPath("/chat/:contactId/", location.pathname);

  // 🧠 Проверяем, есть ли pending-запросы, кроме chatApi.getAllChats
  const isLoading = useSelector((state) => {
    const queries = state.api?.queries || {};

    return Object.entries(queries).some(([key, query]) => {
      if (!query || query.status !== "pending") return false;

      // 🚫 Игнорируем загрузку chatApi (например, getAllChats)
      const isChatQuery = key.startsWith("getAllChats");
      return !isChatQuery;
    });
  });

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    // 🛑 Если мы в диалоге — не показываем загрузку
    if (isDialogRoute) {
      setShowSpinner(false);
      return;
    }

    let timer;
    if (isLoading) {
      timer = setTimeout(() => setShowSpinner(true), delay);
    } else {
      setShowSpinner(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [isLoading, delay, isDialogRoute]);

  return showSpinner;
};
