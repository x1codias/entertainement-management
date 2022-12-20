import { Fragment, useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';

import styles from './Accordion.module.css';

const Accordion = (props) => {
  const [isOpened, setIsOpened] = useState(false);

  const accordionHandler = () => {
    setIsOpened((prevMode) => !prevMode);
  };

  return (
    <Fragment>
      <div className={styles.title} onClick={accordionHandler}>
        <span className={styles['title-text']}>{props.title}</span>
        <div className={styles['arrow-wrapper']}>
          <FaAngleDown
            className={
              isOpened
                ? `${styles['fa-rotate-180']} ${styles['fa-angle-down']}`
                : styles['fa-angle-down']
            }
          />
        </div>
      </div>
      <div
        className={
          isOpened
            ? `${styles.content} ${styles['content-open']}`
            : styles.content
        }
      >
        <div
          className={
            isOpened
              ? `${styles['content-text']} ${styles['content-text-open']}`
              : styles['content-text']
          }
        >
          {props.content}
        </div>
      </div>
    </Fragment>
  );
};

export default Accordion;
