import { createContext, useContext, useEffect, useRef, useState } from 'react';
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

    useEffect(() => {
        if (!socket || !isConnected) {
            console.error('Socket is not connected');
            return;
        }

        // Отправляем событие на сервер с данными
        socket.emit(eventName, data);
        console.log(`${eventName} event sent with data:`, data);

        // Очистка не требуется, так как мы только отправляем событие
        return () => {};
    }, [socket, isConnected, eventName, data]);
};