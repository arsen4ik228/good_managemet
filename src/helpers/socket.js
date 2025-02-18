import io from "socket.io-client";
import { baseUrl, userId } from '@helpers/constants';

let socket = null;

// Функция для создания соединения
export const createConnectionSocket = () => {
    return new Promise((resolve, reject) => {
        if (socket) {
            resolve(socket); // Возвращаем существующий сокет, если он уже создан
            return;
        }

        // Создаем новый сокет
        socket = io(`${baseUrl}convert`, {
            cors: {
                credentials: true,
            },
            auth: {
                userId: userId,
            },
            transports: ["websocket"],
        });

        // Обработка события подключения
        socket.on("connect", () => {
            console.log('Socket connected');
            resolve(socket); // Разрешаем промис, когда сокет подключится
        });

        // Обработка события отключения
        socket.on("disconnect", (reason) => {
            console.log('Socket disconnected:', reason);
            // Здесь можно выполнить дополнительные действия при отключении
        });

        // Обработка ошибок подключения
        socket.on("connect_error", (error) => {
            console.error('Socket connection error:', error);
            reject(error); // Отклоняем промис в случае ошибки
        });
    });
};

// Функция для подписки на событие convertCreationEvent
export const subscribeToConvertCreationEvent = (callback) => {
    if (socket) {
        console.log('subscribeToConvertCreationEvent', socket)
        socket.on("convertCreationEvent", (data) => {
            callback(data);
        });
    } else {
        console.error("Socket is not connected.");
    }
};

// Функция для отключения сокета
export const disconnectSocket = () => {
    if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        // socket.off("convertCreationEvent");
        socket.disconnect();
        socket = null; // Сбрасываем сокет
    }
};