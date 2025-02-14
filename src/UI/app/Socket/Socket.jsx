import React, { useEffect, useState } from 'react';
import {
    createConnectionSocket,
    subscribeToConvertCreationEvent,
    disconnectSocket,
} from './socket.js';

export default function SocketComponent() {
    const [response, setResponse] = useState(null);
    
    useEffect(() => {
        // Создаем соединение
        const socket = createConnectionSocket();
        
        // Обработчик для успешного подключения
        const handleConnect = () => {
            console.log('Socket connected, subscribing to events...');
            
            // Подписываемся на событие convertCreationEvent
            const handleMessageCreation = (data) => {
                console.log('New message created:', data);
                setResponse(data);
            };
            
            // Получаем функцию очистки от subscribeToConvertCreationEvent
            const cleanupSubscription = subscribeToConvertCreationEvent(handleMessageCreation);
            
            // Очистка при размонтировании компонента
            return () => {
                // Сначала очищаем подписку на convertCreationEvent
                cleanupSubscription?.();
                
                // Затем отписываемся от события connect
                socket.off('connect', handleConnect);
                
                // Наконец отключаем сокет
                disconnectSocket();
            };
        };
        
        // Подписываемся на событие connect
        socket.on('connect', handleConnect);
        
        // Возвращаем функцию очистки для useEffect
        return () => {
            socket.off('connect', handleConnect);
        };
    }, []);

    return (
        <div>
            <h1>Socket Component</h1>
            <p>Response: {JSON.stringify(response)}</p>
        </div>
    );
}