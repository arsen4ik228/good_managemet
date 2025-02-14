import io from "socket.io-client";
import { baseUrl, userId } from '@helpers/constants';

let socket = null;

// Функция для создания соединения
export const createConnectionSocket = () => {
    if (socket) {
        return socket; // Возвращаем существующий сокет, если он уже создан
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
    });

    // Обработка события отключения
    socket.on("disconnect", () => {
        console.log('Socket disconnected');
    });

    // Обработка ошибок подключения
    socket.on("connect_error", (error) => {
        console.error('Socket connection error:', error);
    });

    return socket;
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
        socket.off("convertCreationEvent");
        socket.disconnect();
        socket = null; // Сбрасываем сокет
    }
};