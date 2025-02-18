import { useEffect, useState } from 'react';
import {
    createConnectionSocket,
    subscribeToConvertCreationEvent,
    disconnectSocket,
} from '@helpers/socket.js';

export const useSocket = (eventName, callback) => {
    const [response, setResponse] = useState(null);

    useEffect(() => {
        let socket;

        const initializeSocket = async () => {
            try {
                socket = await createConnectionSocket();

                // Подписываемся на указанное событие
                console.log('subscribe to:', eventName)
                socket.on(eventName, (data) => {
                    setResponse(data); // Обновляем состояние
                    if (callback) {
                        callback(data); // Вызываем переданный callback
                    }
                });
            } catch (error) {
                console.error('Failed to connect to socket:', error);
            }
        };

        initializeSocket();

        return () => {
            if (socket) {
                socket.off(eventName); 
                console.log('off subscribtion: ', eventName)
                disconnectSocket();
            }
        };
    }, [eventName, callback]); 

    return response;
};