import { Fragment, useState } from 'react';
import { IconContext } from 'react-icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import styles from './Pagination.module.css';

const Pagination = (props) => {
  const pages = [];

  for (let i = 1; i <= Math.ceil(props.dataLength / 20); i++) {
    pages.push(i);
  }

  const renderPageNumbers = pages.map((number) => {
    if (
      number < props.maxPageNumberLimit + 1 &&
      number > props.minPageNumberLimit
    ) {
      return (
        <li
          key={number}
          id={number}
          onClick={props.onClickPage}
          className={props.currentPage === number ? styles.active : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });

  if (props.gallery) {
    return (
      <Fragment>
        {props.currentPage > 1 && (
          <button className={styles.btn} onClick={props.onClickPrev}>
            <span>
              <IconContext.Provider value={{ size: '2.4rem' }}>
                <FaChevronLeft />
              </IconContext.Provider>
            </span>
          </button>
        )}
        {props.children}
        {props.currentPage !== props.numberOfPages && (
          <button className={styles.btn} onClick={props.onClickNext}>
            <span>
              <IconContext.Provider value={{ size: '2.4rem' }}>
                <FaChevronRight />
              </IconContext.Provider>
            </span>
          </button>
        )}
      </Fragment>
    );
  }

  return (
    <div className={styles.container}>
      <ul className={styles.pageNumbers}>
        {props.currentPage !== 1 && (
          <li>
            <button onClick={props.onClickPrev}>Prev</button>
          </li>
        )}
        {props.minPageNumberLimit >= 1 ? <li>&hellip;</li> : null}
        {renderPageNumbers}
        {pages.length > props.maxPageNumberLimit ? <li>&hellip;</li> : null}

        <li>
          <button onClick={props.onClickNext}>Next</button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
