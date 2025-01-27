import { isTokenValid } from "./tokenValid"; // Функция проверки токена
import { refreshTokens } from "../authApi"; // Функция обновления токенов

export const prepareHeaders = async (headers) => {
  const token = localStorage.getItem("accessToken");
  
  // Если токена нет, перенаправляем на главную страницу
  if (token == null) {
    window.location.href = `#/`;
    return headers;
  }

  // Проверка на валидность токена
  if (isTokenValid(token)) {
    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  }

  // Если токен невалиден — обновляем
  const fingerprint = localStorage.getItem("fingerprint"); // Замените на реальный fingerprint
  const response = await refreshTokens(fingerprint); // Функция обновления токенов
  const newAccessToken = response?.newAccessToken;

  // Если есть новый токен, сохраняем его и добавляем в заголовок
  if (newAccessToken) {
    localStorage.setItem("accessToken", newAccessToken);
    headers.set("Authorization", `Bearer ${newAccessToken}`);
  }

  return headers;
};
