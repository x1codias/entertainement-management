import { useContext, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import Button from './Button';
import { AuthContext } from '../context/auth-context';

import styles from './Header.module.css';

const Header = () => {
  const { pathname } = useLocation();
  const auth = useContext(AuthContext);
  const [isOpened, setIsOpenened] = useState(false);
  const username = JSON.parse(localStorage.getItem('userData'));
  const navigate = useNavigate();

  const isOpenedHandler = () => {
    setIsOpenened((prevState) => !prevState);
  };

  const logoutHandler = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <Link
        className={styles['header-title']}
        to="/"
        state={{ from: pathname }}
      >
        ChillPlanner
      </Link>
      {pathname !== '/auth' && !auth.isLoggedIn && (
        <div className={styles['header-auth']}>
          <Button login to="/auth" exact="true" state={{ from: pathname }}>
            LOG IN
          </Button>
        </div>
      )}
      {auth.isLoggedIn && (
        <div className={styles.dropdown}>
          <button onClick={isOpenedHandler} className={styles['dropdown-btn']}>
            {username.username}
          </button>
          {isOpened && (
            <ul className={styles.menu}>
              <li className={styles['menu-item']}>
                <NavLink to={`/profile/${username.username}`}>
                  My Profile
                </NavLink>
              </li>
              <li className={styles['menu-item']}>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </ul>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
