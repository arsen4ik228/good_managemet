import { url } from "./baseUrl"; // Импорт базового URL

// Функция для обновления токенов
export const refreshTokens = async (fingerprint) => {
  try {
    const response = await fetch(`${url}auth/refresh-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fingerprint }),
      credentials: "include", // Важно для отправки куки
    });

    if (!response.ok) {
      throw new Error(`Ошибка при обновлении токенов: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Вернём данные с сервера (например, новый токен)
  } catch (error) {
    console.error("Ошибка в процессе обновления токенов:", error);
    throw error;
  }
};
