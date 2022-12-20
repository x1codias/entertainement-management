import { Fragment } from 'react';
import { IconContext } from 'react-icons';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
          className={props.currentPage === number ? styles.active : null}
        >
          <Link onClick={props.onClickPage} to={`?page=${number}`}>
            {number}
          </Link>
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
    <div className={`${styles.container} ${props.gridStyle}`}>
      <ul className={styles.pageNumbers}>
        {props.currentPage !== 1 && (
          <li>
            <Link onClick={props.onClickPrev} to={`?page=${props.prevPage}`}>
              Prev
            </Link>
          </li>
        )}
        {props.minPageNumberLimit >= 1 ? (
          <li>
            <Link to={`?page=1`} onClick={props.onClickFirstPage}>
              &hellip;
            </Link>
          </li>
        ) : null}
        {renderPageNumbers}
        {pages.length > props.maxPageNumberLimit ? (
          <li>
            <Link
              to={`?page=${props.lastPage}`}
              onClick={props.onClickLastPage}
            >
              &hellip;
            </Link>
          </li>
        ) : null}

        <li>
          <Link onClick={props.onClickNext} to={`?page=${props.nextPage}`}>
            Next
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
