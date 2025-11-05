import io from "socket.io-client";
import { socketUrl, userId } from '@helpers/constants';

export const createConnectionSocket = () => {
    return new Promise((resolve, reject) => {
        const socket = io(`${socketUrl}convert`, {
            cors: {
                credentials: true,
            },
            auth: {
                userId: userId,
            },
            transports: ["websocket"],
            // Настройки для улучшения стабильности
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            // Ping/pong настройки
            pingTimeout: 60000,
            pingInterval: 25000,
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

        // Таймаут для соединения
        const connectionTimeout = setTimeout(() => {
            reject(new Error('Socket connection timeout'));
        }, 10000);

        socket.on("connect", () => {
            clearTimeout(connectionTimeout);
        });
    });
};

export const disconnectSocket = (socket) => {
    if (socket) {
        console.log('Disconnecting socket');
        socket.removeAllListeners(); // Очищаем все обработчики
        socket.disconnect();
    }
};