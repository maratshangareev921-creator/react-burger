import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

import styles from './app-header.module.css';

export const AppHeader = () => {
  const { pathname } = useLocation();
  const isConstructor = pathname === '/' || pathname.startsWith('/ingredients');
  const isFeed = pathname.startsWith('/feed');
  const isProfile = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            className={`${styles.link} ${isConstructor ? styles.link_active : ''}`}
          >
            <BurgerIcon type={isConstructor ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>
          <NavLink
            to="/feed"
            className={`${styles.link} ${isFeed ? styles.link_active : ''} ml-10`}
          >
            <ListIcon type={isFeed ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>
        <NavLink to="/" className={styles.logo} aria-label="На главную">
          <Logo />
        </NavLink>
        <NavLink
          to="/profile"
          className={`${styles.link} ${styles.link_position_last} ${
            isProfile ? styles.link_active : ''
          }`}
        >
          <ProfileIcon type={isProfile ? 'primary' : 'secondary'} />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </NavLink>
      </nav>
    </header>
  );
};
