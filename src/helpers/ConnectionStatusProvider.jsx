// ConnectionStatusProvider.jsx
import { notification } from 'antd';
import { useSocket } from './SocketContext';
import { useEffect, useRef, useState } from 'react';

export const ConnectionStatusProvider = ({ children }) => {
  const { isConnected } = useSocket([], null);
  const [api, contextHolder] = notification.useNotification();
  const wasConnectedRef = useRef(false);
  const initialLoadRef = useRef(true);
  const [showReconnectNotification, setShowReconnectNotification] = useState(false);

  useEffect(() => {
    // Пропускаем первоначальную загрузку
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      wasConnectedRef.current = isConnected;
      return;
    }

    // Показываем уведомление только при потере соединения после успешного подключения
    if (!isConnected && wasConnectedRef.current) {
      setShowReconnectNotification(true);
      api.error({
        message: 'Соединение с сервером потеряно',
        description: 'Попытка переподключения... Если проблема сохраняется, обновите страницу.',
        duration: 0,
        key: 'connection-status',
        placement: 'topRight',
        btn: (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => window.location.reload()}
              className="ant-btn ant-btn-primary ant-btn-sm"
            >
              Обновить
            </button>
            <button
              onClick={() => {
                api.destroy('connection-status');
                setShowReconnectNotification(false);
              }}
              className="ant-btn ant-btn-default ant-btn-sm"
            >
              Закрыть
            </button>
          </div>
        ),
      });
    } 
    // Показываем успех при восстановлении соединения после потери
    else if (isConnected && !wasConnectedRef.current && showReconnectNotification) {
      api.success({
        message: 'Соединение восстановлено',
        duration: 2,
        placement: 'topRight',
      });
      api.destroy('connection-status');
      setShowReconnectNotification(false);
    }

    wasConnectedRef.current = isConnected;
  }, [isConnected, api, showReconnectNotification]);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};