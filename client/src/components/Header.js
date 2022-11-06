import { Link } from 'react-router-dom';
import Button from './Button';

import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link className={styles['header-title']} to="/">
        ChillPlanner
      </Link>
      <div className={styles['header-auth']}>
        <Button login to="/auth" exact="true">
          LOG IN
        </Button>
      </div>
    </header>
  );
};

export default Header;
