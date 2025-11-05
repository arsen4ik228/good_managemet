import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createConnectionSocket, disconnectSocket } from '@helpers/socket.js';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 5;
    const baseReconnectDelay = 1000; // 1 секунда

    const connect = async () => {
        try {
            console.log('Creating new socket connection');
            socketRef.current = await createConnectionSocket();
            setIsConnected(true);
            reconnectAttemptsRef.current = 0;
            
            // Обработчики событий сокета
            socketRef.current.on("disconnect", (reason) => {
                console.log('Socket disconnected:', reason);
                setIsConnected(false);
                scheduleReconnect();
            });

            socketRef.current.on("connect_error", (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
                scheduleReconnect();
            });

            socketRef.current.on("reconnect", (attemptNumber) => {
                console.log('Socket reconnected after', attemptNumber, 'attempts');
                setIsConnected(true);
                reconnectAttemptsRef.current = 0;
            });

        } catch (error) {
            console.error('Failed to connect to socket:', error);
            scheduleReconnect();
        }
    };

    const scheduleReconnect = () => {
        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            console.warn('Max reconnection attempts reached');
            return;
        }

        // Экспоненциальная задержка
        const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
        reconnectAttemptsRef.current++;

        console.log(`Scheduling reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
            connect();
        }, delay);
    };

    const disconnect = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (socketRef.current) {
            disconnectSocket(socketRef.current);
            socketRef.current = null;
        }
        setIsConnected(false);
    };

    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, []);

    // Обработчик видимости страницы
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !isConnected && !socketRef.current) {
                // Если вкладка стала активной и соединение разорвано - переподключаемся
                console.log('Tab became visible, reconnecting socket...');
                connect();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isConnected]);

    return (
        <SocketContext.Provider value={{ 
            socket: socketRef.current, 
            isConnected,
            reconnect: connect,
            disconnect 
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = (eventNames, callback) => {
    const { socket, isConnected } = useContext(SocketContext);
    const [response, setResponse] = useState({});
    const callbackRef = useRef(callback);

    // Обновляем ref callback при изменении
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!socket || !isConnected) {
            console.log('Socket is not connected, skipping event subscription');
            return;
        }

        const eventHandlers = eventNames.map((eventName) => {
            const handler = (data) => {
                console.log('Data received:', data);
                setResponse((prev) => ({ ...prev, [eventName]: data }));
                if (callbackRef.current) {
                    callbackRef.current(eventName, data);
                }
            };
            
            console.log('Socket: subscribe to', eventName);
            socket.on(eventName, handler);
            
            return { eventName, handler };
        });

        return () => {
            eventHandlers.forEach(({ eventName, handler }) => {
                console.log('unsubscribe from', eventName);
                socket.off(eventName, handler);
            });
        };
    }, [socket, isConnected, eventNames]);

    return response;
};

export const useEmitSocket = (eventName, data, options = {}) => {
    const { socket, isConnected } = useContext(SocketContext);
    const { retry = true, maxRetries = 3 } = options;
    const retryCountRef = useRef(0);

    const stableData = useMemo(() => data, [JSON.stringify(data)]);
    const stableEventName = useMemo(() => eventName, [eventName]);

    const emitWithRetry = useMemo(() => {
        return (event, payload, currentRetry = 0) => {
            if (!socket || !isConnected) {
                if (retry && currentRetry < maxRetries) {
                    console.log(`Socket not connected, retrying in 1s... (${currentRetry + 1}/${maxRetries})`);
                    setTimeout(() => {
                        emitWithRetry(event, payload, currentRetry + 1);
                    }, 1000);
                } else {
                    console.error('Socket: Unable to emit event - socket not connected');
                }
                return;
            }

            try {
                socket.emit(event, payload);
                console.log(`Socket: ${event} event sent with data:`, payload);
                retryCountRef.current = 0;
            } catch (error) {
                console.error(`Socket: Error emitting event ${event}:`, error);
            }
        };
    }, [socket, isConnected, retry, maxRetries]);

    useEffect(() => {
        if (!stableEventName || !stableData) {
            return;
        }

        emitWithRetry(stableEventName, stableData);
    }, [stableEventName, stableData, emitWithRetry]);

    // Функция для ручной отправки
    const manualEmit = useMemo(() => {
        return (customData = null) => {
            const payload = customData !== null ? customData : stableData;
            emitWithRetry(stableEventName, payload);
        };
    }, [stableEventName, stableData, emitWithRetry]);

    return manualEmit;
};