import { useState, useEffect } from "react";

export const useMutationHandler = (isSuccess, isError, resetMutation) => {
  const [localIsResponse, setLocalIsResponse] = useState(false);

  // Устанавливаем локальное состояние при успехе или ошибке мутации
  useEffect(() => {
    if (isSuccess || isError) {
      setLocalIsResponse(true);
    }
  }, [isSuccess, isError]);

  // Сбрасываем состояние мутации через 2 секунды
  useEffect(() => {
    if (localIsResponse) {
      const timer = setTimeout(() => {
        resetMutation(); // Сбрасываем состояние мутации
        setLocalIsResponse(false); // Сбрасываем локальное состояние
      }, 2000);

      return () => clearTimeout(timer); // Очищаем таймер при размонтировании
    }
  }, [localIsResponse, resetMutation]);

  return localIsResponse;
};