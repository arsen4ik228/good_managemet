import io from "socket.io-client";
import { baseUrl, userId } from '@helpers/constants';

// Функция для создания соединения
export const createConnectionSocket = () => {
    return new Promise((resolve, reject) => {
        const socket = io(`${baseUrl}convert`, {
            cors: {
                credentials: true,
            },
            auth: {
                userId: userId,
            },
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log('Socket connected');
            resolve(socket);
        });

        socket.on("disconnect", (reason) => {
            console.log('Socket disconnected:', reason);
        });

        socket.on("connect_error", (error) => {
            console.error('Socket connection error:', error);
            reject(error);
        });
    });
};

// Функция для отключения сокета
export const disconnectSocket = (socket) => {
    if (socket) {
        console.log('disconnect socket');
        socket.disconnect();
    }
};