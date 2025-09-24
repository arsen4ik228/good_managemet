import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const useGlobalLoading = (delay = 1000) => {
  // RTK Query: проверяем, есть ли активные запросы
  const isLoading = useSelector((state) =>
    Object.values(state.api?.queries || {}).some(
      (query) => query?.status === "pending"
    )
  );

  // Локальное состояние для отложенного отображения спиннера
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timer;

    if (isLoading) {
      // если загрузка началась — запускаем таймер
      timer = setTimeout(() => {
        setShowSpinner(true);
      }, delay);
    } else {
      // если загрузка закончилась — сразу убираем спиннер и чистим таймер
      setShowSpinner(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return showSpinner;
};
