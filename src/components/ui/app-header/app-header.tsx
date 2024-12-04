import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={`${styles.link} ${
              location.pathname === '/' ? styles.link_active : ''
            }`}
          >
            <BurgerIcon
              type={location.pathname === '/' ? 'primary' : 'secondary'}
            />
            <p
              className={`text text_type_main-default ml-2 mr-10 ${
                location.pathname === '/' ? styles.link_active : ''
              }`}
            >
              Конструктор
            </p>
          </Link>
          <Link
            to='/feed'
            className={`${styles.link} ${
              location.pathname === '/feed' ? styles.link_active : ''
            }`}
          >
            <ListIcon
              type={location.pathname === '/feed' ? 'primary' : 'secondary'}
            />
            <p
              className={`text text_type_main-default ml-2 ${
                location.pathname === '/feed' ? styles.link_active : ''
              }`}
            >
              Лента заказов
            </p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Logo className={styles.logoImage} />
        </div>
        <div className={styles.link_position_last}>
          <Link
            to='/profile'
            className={`${styles.link} ${
              location.pathname.startsWith('/profile') ? styles.link_active : ''
            }`}
          >
            <ProfileIcon
              type={
                location.pathname.startsWith('/profile')
                  ? 'primary'
                  : 'secondary'
              }
            />
            <p
              className={`text text_type_main-default ml-2 ${
                location.pathname.startsWith('/profile')
                  ? styles.link_active
                  : ''
              }`}
            >
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
