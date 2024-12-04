import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { fetchFeed } from '../../services/reducers/feedSlice';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

// Функция для фильтрации заказов по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные из Redux store
  const { orders, total, totalToday, isLoading, error } = useSelector(
    (state: RootState) => state.feed
  );

  // Готовые заказы
  const readyOrders = getOrders(orders, 'done');

  // Заказы в процессе
  const pendingOrders = getOrders(orders, 'pending');

  // Если данные загружаются или произошла ошибка
  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка загрузки данных: {error}</p>;
  }

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
