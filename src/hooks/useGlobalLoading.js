import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const useGlobalLoading = (delay = 1000) => {
  const isLoading = useSelector((state) => {
    const queries = state.api?.queries || {};

    return Object.entries(queries)
      .filter(([key]) => {
        // ❗️Фильтруем по имени запроса — исключаем Convert и Message
        return !key.toLowerCase().includes("convert") && !key.toLowerCase().includes("message");
      })
      .some(([_, query]) => query?.status === "pending");
  });

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timer;

    if (isLoading) {
      timer = setTimeout(() => setShowSpinner(true), delay);
    } else {
      setShowSpinner(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [isLoading, delay]);

  return showSpinner;
};
