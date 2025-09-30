import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";

export const useGlobalLoading = (delay = 1000) => {
  const location = useLocation();

  // ✅ Проверяем, находимся ли мы в диалоговой странице
  const isDialogRoute =
    matchPath("/:organizationId/chat/:contactId/:convertId", location.pathname) ||
    matchPath("/chat/:contactId/:convertId", location.pathname);

  // 🧠 Проверяем, есть ли хоть один запрос со статусом "pending"
  const isLoading = useSelector((state) => {
    const queries = state.api?.queries || {};
    return Object.values(queries).some((query) => query?.status === "pending");
  });

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    // 🛑 Если мы находимся в диалоге — никогда не показываем загрузку
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
