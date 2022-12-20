import { NavLink } from 'react-router-dom';
import { IconContext } from 'react-icons';

import { RiMovie2Fill } from 'react-icons/ri';
import { BiMoviePlay } from 'react-icons/bi';
import { AiOutlineTaobao } from 'react-icons/ai';
import { GiOpenBook } from 'react-icons/gi';
import { IoLogoGameControllerB } from 'react-icons/io';

import styles from './Sidebar.module.css';
import { Fragment } from 'react';

const Sidebar = (props) => {
  return (
    <Fragment>
      <nav className={styles['nav__container']}>
        <ul className={styles.nav}>
          <li className={styles['nav__item']}>
            <NavLink className={styles['nav__link']} to={`/movies`}>
              <svg>
                <IconContext.Provider
                  value={{ size: '26px', className: 'nav__icon' }}
                >
                  <RiMovie2Fill />
                </IconContext.Provider>
              </svg>
              <span>Movies</span>
            </NavLink>
          </li>
          <li className={styles['nav__item']}>
            <NavLink className={styles['nav__link']} to="/shows">
              <svg>
                <IconContext.Provider
                  value={{ size: '26px', className: 'nav__icon' }}
                >
                  <BiMoviePlay />
                </IconContext.Provider>
              </svg>
              <span>Shows</span>
            </NavLink>
          </li>
          {/* <li className={styles['nav__item']}>
            <NavLink className={styles['nav__link']} to="/animes">
              <svg>
                <IconContext.Provider
                  value={{ size: '26px', className: 'nav__icon' }}
                >
                  <AiOutlineTaobao />
                </IconContext.Provider>
              </svg>
              <span>Animes</span>
            </NavLink>
          </li> */}
          <li className={styles['nav__item']}>
            <NavLink className={styles['nav__link']} to="/books">
              <svg>
                <IconContext.Provider
                  value={{ size: '26px', className: 'nav__icon' }}
                >
                  <GiOpenBook />
                </IconContext.Provider>
              </svg>
              <span>Books</span>
            </NavLink>
          </li>
          <li className={styles['nav__item']}>
            <NavLink className={styles['nav__link']} to="/games">
              <svg>
                <IconContext.Provider
                  value={{ size: '26px', className: 'nav__icon' }}
                >
                  <IoLogoGameControllerB />
                </IconContext.Provider>
              </svg>
              <span>Games</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className={styles.wrapper}>{props.children}</main>
    </Fragment>
  );
};

export default Sidebar;
