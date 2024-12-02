import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/reducers/feedSlice';
import { RootState } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // Получаем данные из Redux-хранилища
  const { orders, isLoading, error } = useSelector(
    (state: RootState) => state.feed
  );

  useEffect(() => {
    // Загружаем данные ленты заказов при монтировании компонента
    dispatch(fetchFeed());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className='text text_type_main-medium'>{`Ошибка загрузки данных: ${error}`}</p>
    );
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchFeed())} // Пример для обновления данных
    />
  );
};
