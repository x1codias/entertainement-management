import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons';

import { RiMovie2Fill } from 'react-icons/ri';
import { BiMoviePlay } from 'react-icons/bi';
import { AiOutlineTaobao } from 'react-icons/ai';
import { GiOpenBook } from 'react-icons/gi';
import { IoLogoGameControllerB } from 'react-icons/io';

import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <nav className={styles['nav__container']}>
      <ul className={styles.nav}>
        <li className={styles['nav__item']}>
          <IconContext.Provider
            value={{ size: '26px', className: 'nav__icon' }}
          >
            <RiMovie2Fill />
          </IconContext.Provider>
          <NavLink className={styles['nav__link']} to="/movies">
            Movies
          </NavLink>
        </li>
        <li className={styles['nav__item']}>
          <IconContext.Provider
            value={{ size: '26px', className: 'nav__icon' }}
          >
            <BiMoviePlay />
          </IconContext.Provider>
          <NavLink className={styles['nav__link']} to="/shows">
            Shows
          </NavLink>
        </li>
        <li className={styles['nav__item']}>
          <IconContext.Provider
            value={{ size: '26px', className: 'nav__icon' }}
          >
            <AiOutlineTaobao />
          </IconContext.Provider>
          <NavLink className={styles['nav__link']} to="/animes">
            Animes
          </NavLink>
        </li>
        <li className={styles['nav__item']}>
          <IconContext.Provider
            value={{ size: '26px', className: 'nav__icon' }}
          >
            <GiOpenBook />
          </IconContext.Provider>
          <NavLink className={styles['nav__link']} to="/books">
            Books
          </NavLink>
        </li>
        <li className={styles['nav__item']}>
          <IconContext.Provider
            value={{ size: '26px', className: 'nav__icon' }}
          >
            <IoLogoGameControllerB />
          </IconContext.Provider>
          <NavLink className={styles['nav__link']} to="/games">
            Games
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
