import React, { createContext, useState, useContext } from 'react';

// Создаем контекст
const ObserversContext = createContext();

// Провайдер контекста
export const ObserversProvider = ({ children }) => {
  // Массив наблюдателей
  const [observers, setObservers] = useState([]);

  // Функция для добавления наблюдателя
  const addObserver = (observer) => {
    setObservers(prev => [...prev, observer]);
  };

  // Функция для удаления наблюдателя
  const removeObserver = (id) => {
    setObservers(prev => prev.filter(obs => obs.id !== id));
  };

  // Функция для обновления наблюдателя
  const updateObserver = (id, updatedData) => {
    setObservers(prev => 
      prev.map(obs => 
        obs.id === id ? { ...obs, ...updatedData } : obs
      )
    );
  };

  // Функция для полной замены массива
  const setObserversList = (newObservers) => {
    setObservers(newObservers);
  };

  // Очистка всех наблюдателей
  const clearObservers = () => {
    setObservers([]);
  };

  return (
    <ObserversContext.Provider 
      value={{ 
        observers, 
        addObserver,
        removeObserver,
        updateObserver,
        setObserversList,
        setObservers,
        clearObservers
      }}
    >
      {children}
    </ObserversContext.Provider>
  );
};

// Кастомный хук для удобного использования контекста
export const useObservers = () => {
  const context = useContext(ObserversContext);
  if (!context) {
    throw new Error('useObservers must be used within an ObserversProvider');
  }
  return context;
};