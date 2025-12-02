import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RoutePersist = () => {
  const location = useLocation();

  useEffect(() => {
    // Сохраняем текущий путь в localStorage
    localStorage.setItem('lastVisitedPath', location.pathname + location.search);
  }, [location]);

  return null; // Этот компонент ничего не рендерит
};

export default RoutePersist;