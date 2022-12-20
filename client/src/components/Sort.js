import { Fragment, useState } from 'react';
import { IconContext } from 'react-icons';
import {
  FaChevronDown,
  FaChevronUp,
  FaRedoAlt,
  FaRegCalendarAlt,
  FaTheaterMasks,
  FaThumbsUp,
  FaTrophy,
} from 'react-icons/fa';

import styles from './Sort.module.css';

const Sort = (props) => {
  const [isActive, setIsActive] = useState(false);

  const sortArray = [
    { name: 'Relevance', icon: 'Masks' },
    { name: 'Popularity', icon: 'Trophy' },
    { name: 'Rating', icon: 'Thumbs' },
    { name: 'Latest', icon: 'Calendar' },
    { name: 'Upcoming', icon: 'Redo' },
  ];

  const toggleDropdown = () => {
    setIsActive((prevState) => !prevState);
  };

  const sortOptionsCostum = sortArray.map((sort, index) => {
    return (
      <div
        key={index}
        className={styles['dropdown-item']}
        onClick={props.onClickSelected}
        value={sort.name}
      >
        <IconContext.Provider value={{ className: styles['fa-icons'] }}>
          {sort.icon === 'Masks' && <FaTheaterMasks className={styles.masks} />}
          {sort.icon === 'Trophy' && <FaTrophy className={styles.trophy} />}
          {sort.icon === 'Thumbs' && <FaThumbsUp className={styles.thumbs} />}
          {sort.icon === 'Calendar' && (
            <FaRegCalendarAlt className={styles.calendar} />
          )}
          {sort.icon === 'Redo' && <FaRedoAlt className={styles.redo} />}
        </IconContext.Provider>
        {sort.name}
      </div>
    );
  });

  return (
    <Fragment>
      <div className={styles.dropdown}>
        <div className={styles['dropdown-btn']} onClick={toggleDropdown}>
          {props.selected} <FaChevronDown />
        </div>
        <div
          className={
            isActive
              ? `${styles['dropdown-content']} ${styles.show}`
              : `${styles['dropdown-content']}`
          }
        >
          {sortOptionsCostum}
        </div>
      </div>
    </Fragment>
  );
};

export default Sort;
