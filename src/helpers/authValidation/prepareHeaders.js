import { isTokenValid } from "./tokenValid";
import { refreshTokens } from "./refreshTokens";
import { startRefreshing, stopRefreshing } from "@slices";

let refreshPromise = null; // Локальная переменная для хранения Promise

export const prepareHeaders = async (headers) => {
  const { store } = await import("../../store"); // ⚠️ Lazy Import
  const { dispatch, getState } = store;
  const { isRefreshing } = getState().auth;

  const token = localStorage.getItem("accessToken");

  if (token == null) {
    window.location.href = `#/`;
    return headers;
  }

  if (isTokenValid(token)) {
    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  }

  if (!isRefreshing) {
    dispatch(startRefreshing());

    refreshPromise = refreshTokens(localStorage.getItem("fingerprint"))
      .then((response) => {
        const newAccessToken = response?.newAccessToken;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
        }
        return newAccessToken;
      })
      .catch((error) => {
        window.location.href = `#/error`;
        console.error(error);
        return null;
      })
      .finally(() => {
        dispatch(stopRefreshing());
        refreshPromise = null; // Сбрасываем Promise после завершения
      });
  }

  // Ждем завершения обновления токена
  const newAccessToken = await refreshPromise;

  if (newAccessToken) {
    headers.set("Authorization", `Bearer ${newAccessToken}`);
  }

  return headers;
};