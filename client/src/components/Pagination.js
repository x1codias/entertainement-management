import { useState } from 'react';
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

  return (
    <div className={styles.container}>
      <ul className={styles.pageNumbers}>
        <li>
          <button onClick={props.onClickPrev}>Prev</button>
        </li>
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
