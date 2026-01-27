// hooks/useNavigationHistory.js
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const useNavigationHistory = () => {
    const location = useLocation();
    const [history, setHistory] = useState({});

    // Инициализация из localStorage при загрузке
    useEffect(() => {
        const savedHistory = localStorage.getItem('navigation_history');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error('Error parsing navigation history:', e);
            }
        }
    }, []);

    // Сохранение в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('navigation_history', JSON.stringify(history));
    }, [history]);

    // Обновление истории при переходе
    const updateHistory = (sectionKey, path) => {
        setHistory(prev => ({
            ...prev,
            [sectionKey]: path
        }));
    };

    // Получение последнего пути для раздела
    const getLastPath = (sectionKey) => {
        return history[sectionKey] || null;
    };

    return { history, updateHistory, getLastPath };
};

export default useNavigationHistory;