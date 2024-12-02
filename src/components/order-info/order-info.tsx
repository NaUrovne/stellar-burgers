import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderById,
  clearSelectedOrder
} from '../../services/reducers/feedSlice';
import { RootState } from 'src/services/store';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { selectedOrder, isLoadingOrder, error } = useSelector(
    (state: RootState) => state.feed
  );
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.items
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(Number(id)));
    }

    return () => {
      dispatch(clearSelectedOrder()); // Очищаем данные при размонтировании компонента
    };
  }, [dispatch, id]);

  // Обрабатываем данные для отображения
  const orderInfo = useMemo(() => {
    if (!selectedOrder || !ingredients.length) return null;

    const date = new Date(selectedOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = selectedOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...selectedOrder,
      ingredientsInfo,
      date,
      total,
      status: selectedOrder.status
    };
  }, [selectedOrder, ingredients]);

  if (isLoadingOrder) {
    return <Preloader />;
  }

  if (error) {
    return <p>Ошибка загрузки заказа: {error}</p>;
  }

  if (!orderInfo) {
    return <p>Заказ не найден</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
