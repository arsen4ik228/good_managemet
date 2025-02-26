import { useEffect, useState, useRef } from 'react';
import { createConnectionSocket, disconnectSocket } from '@helpers/socket.js';

export const useSocket = (eventNames, callback) => {
    const [response, setResponse] = useState({});
    const socketRef = useRef(null);

    useEffect(() => {
        const initializeSocket = async () => {
            if (socketRef.current) return;

            try {
                socketRef.current = await createConnectionSocket();
                eventNames.forEach((eventName) => {
                    console.log('subscribe to', eventName);
                    socketRef.current.on(eventName, (data) => {
                        setResponse((prev) => ({ ...prev, [eventName]: data }));
                        if (callback) {
                            callback(eventName, data);
                        }
                    });
                });
            } catch (error) {
                console.error('Failed to connect to socket:', error);
            }
        };

        initializeSocket();

        return () => {
            if (socketRef.current) {
                eventNames.forEach((eventName) => {
                    console.log('unsubscribe from', eventName);
                    socketRef.current.off(eventName);
                });
                disconnectSocket(socketRef.current);
                socketRef.current = null;
            }
        };
    }, [eventNames, callback]);

    return response;
};