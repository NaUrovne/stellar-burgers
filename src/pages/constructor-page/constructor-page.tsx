import { useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import styles from './constructor-page.module.css';
import { RootState } from '../../services/store';
import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { fetchIngredients } from '../../services/reducers/ingredientsSlice';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector(
    (state: RootState) => state.ingredients
  );

  useEffect(() => {
    // Загружаем ингредиенты при монтировании компонента
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : error ? (
        <p className='text text_type_main-medium'>{`Ошибка загрузки данных: ${error}`}</p>
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
