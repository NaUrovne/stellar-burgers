import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  placeOrder,
  clearOrderModal
} from '../../services/reducers/ingredientsSlice';
import { TOrder } from '@utils-types';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Используем отдельные селекторы для каждого фрагмента состояния
  const bun = useSelector((state: RootState) => state.ingredients.bun);
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const orderModalData = useSelector(
    (state: RootState) => state.ingredients.orderModalData
  );
  const orderRequest = useSelector(
    (state: RootState) => state.ingredients.orderRequest
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  // Мемоизируем объект данных заказа
  const orderData: TOrder | null = useMemo(
    () =>
      orderModalData
        ? {
            _id: '', // Заглушки для полей, которые не используются
            status: '',
            name: 'Ваш заказ',
            createdAt: '',
            updatedAt: '',
            number: orderModalData.orderNumber,
            ingredients: []
          }
        : null,
    [orderModalData]
  );

  // Мемоизируем расчёт цены
  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  // Функция для отправки заказа
  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login'); // Перенаправление на страницу авторизации
      return;
    }
    if (!bun || !ingredients.length) {
      alert('Пожалуйста, выберите булку и ингредиенты!');
      return;
    }

    const ingredientsIds = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id)
    ];

    dispatch(placeOrder(ingredientsIds)); // Отправляем заказ
  };

  // Функция для закрытия модального окна
  const closeOrderModal = () => {
    dispatch(clearOrderModal()); // Закрываем модальное окно
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
