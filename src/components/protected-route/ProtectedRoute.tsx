import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

interface ProtectedRouteProps {
  children: JSX.Element;
  onlyUnAuth?: boolean; // Новый флаг для маршрутов только для неавторизованных пользователей
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (onlyUnAuth && isAuthenticated) {
    // Перенаправляем авторизованных пользователей на главную
    return <Navigate to='/profile' replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    // Перенаправляем неавторизованных пользователей на /login
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
