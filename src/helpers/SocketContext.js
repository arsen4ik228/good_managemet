import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createConnectionSocket, disconnectSocket } from '@helpers/socket.js';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const initializeSocket = async () => {
            if (socketRef.current) {
                console.log('Socket already exists');
                return;
            }

            try {
                console.log('Creating new socket connection');
                socketRef.current = await createConnectionSocket();
                setIsConnected(true);
                console.log('Socket connected:', socketRef.current);
            } catch (error) {
                console.error('Failed to connect to socket:', error);
            }
        };

        initializeSocket();

        return () => {
            if (socketRef.current) {
                console.log('Disconnecting socket');
                disconnectSocket(socketRef.current);
                socketRef.current = null;
                setIsConnected(false);
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (eventNames, callback) => {
    const { socket, isConnected } = useContext(SocketContext);
    const [response, setResponse] = useState({});

    useEffect(() => {
        if (!socket || !isConnected) {
            console.error('Socket is not connected');
            return;
        }

        eventNames.forEach((eventName) => {
            console.log('subscribe to', eventName);
            socket.on(eventName, (data) => {
                console.log('Data received:', data);
                setResponse((prev) => ({ ...prev, [eventName]: data }));
                if (callback) {
                    callback(eventName, data);
                }
            });
        });

        return () => {
            eventNames.forEach((eventName) => {
                console.log('unsubscribe from', eventName);
                socket.off(eventName);
            });
        };
    }, [socket, isConnected, eventNames, callback]);

    return response;
};

export const useEmitSocket = (eventName, data) => {
    const { socket, isConnected } = useContext(SocketContext);

    // Мемоизируем данные, чтобы избежать лишних вызовов
    const stableData = useMemo(() => data, [JSON.stringify(data)]);
    const stableEventName = useMemo(() => eventName, [eventName]);

    useEffect(() => {
        if (!socket || !isConnected) {
            console.error('Socket is not connected');
            return;
        }

        const dataNotEmpty = (data) => {
            return Object.values(data).every(item => item !== null && item !== undefined && item !== '' && item.length>0);
        };

        if (!stableEventName || !dataNotEmpty(stableData)) {
            console.error('Event name or data is invalid');
            return;
        }

        // Отправляем событие на сервер с данными
        socket.emit(stableEventName, stableData);
        console.log(`${stableEventName} event sent with data:`, stableData);

        // Очистка не требуется
        return () => { };
    }, [socket, isConnected, stableEventName, stableData]);
};