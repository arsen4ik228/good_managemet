import { jwtDecode } from 'jwt-decode';

export const isTokenValid = (token) => {
    if (!token) return false;
  
    try {
      const decoded = jwtDecode(token); // Декодируем токен
      const currentTime = Date.now() / 1000; // Текущее время в секундах
      console.log('Decoded token:', decoded); // Отладка токена
      console.log(decoded.exp > currentTime)
      return decoded.exp > currentTime; // Сравниваем срок действия
    } catch (e) {
      console.error('Ошибка при проверке токена:', e);
      return false;
    }
  };