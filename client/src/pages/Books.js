import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import Card from '../components/Card';
import Grid from '../components/Grid';
import Search from '../components/Search';
import Filter from '../components/Filter';
import { useHttpClient } from '../hooks/http-hook';
import { useSearch } from '../hooks/search-hook';
import { usePagination } from '../hooks/pagination-hook';
import Pagination from '../components/Pagination';

import styles from './Books.module.css';
import bookCape from '../assets/book.jpg';

const Books = () => {
  const location = useLocation();
  const [loadedBooks, setLoadedBooks] = useState([]);
  const { inputText, changeHandler } = useSearch();
  const { inputText: inputCategory, changeHandler: categoryChangeHandler } =
    useSearch();
  const { inputText: inputAuthor, changeHandler: authorChangeHandler } =
    useSearch();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const {
    currentPage,
    totalPages,
    minPageNumberLimit,
    maxPageNumberLimit,
    dataLength,
    setDataLength,
    offset,
    setTotalPages,
    pageHandler,
    prevHandler,
    nextHandler,
  } = usePagination('book');

  useEffect(() => {
    const fetchBooks = async () => {
      if (inputText !== '') {
        const url = `${process.env.REACT_APP_GOOGLE_BOOKS_BASE_URL}?q=intitle:${inputText}&orderBy=relevance&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}&maxResults=20&startIndex=${offset}`;
        try {
          const responseData = await sendRequest(url);

          console.log(responseData);

          setDataLength(responseData.totalItems);
          setTotalPages(Math.round((responseData.totalItems + 20 - 1) / 20));
          setLoadedBooks(responseData.items);
        } catch (err) {}
      }
    };
    fetchBooks();
  }, [sendRequest, inputText, setDataLength, setTotalPages, offset]);

  const submitFormHandler = useCallback(
    async (e) => {
      e.preventDefault();

      const author = inputAuthor ? `+inauthor:${inputAuthor}` : '';

      const categories = inputCategory ? `&subject:${inputCategory}` : '';

      const url = `${process.env.REACT_APP_GOOGLE_BOOKS_BASE_URL}?q=intitle:${inputText}${author}${categories}&orderBy=relevance&key=${process.env.REACT_APP_GOOGLE_BOOKS_API_KEY}&maxResults=20&startIndex=${offset}`;

      console.log(url);

      try {
        const responseData = await sendRequest(url);

        console.log(responseData);

        setLoadedBooks(responseData.items);
      } catch (err) {}
    },
    [offset, inputAuthor, inputText, inputCategory, sendRequest]
  );

  const books =
    loadedBooks !== undefined &&
    loadedBooks.map((book) => {
      return (
        <Card
          key={book.id}
          page={location.pathname}
          id={book.id}
          poster={
            book.volumeInfo.imageLinks === undefined
              ? bookCape
              : book.volumeInfo.imageLinks.thumbnail
          }
          title={book.volumeInfo.title}
          description={book.volumeInfo.description}
          isLoading={isLoading}
        />
      );
    });

  return (
    <section className={styles.books}>
      <Grid>
        <Search
          onChange={changeHandler}
          initialValue={inputText}
          gridStyle={styles.search}
        />
        <Filter
          book
          onChangeCategory={categoryChangeHandler}
          inputCategory={inputCategory}
          onChangeAuthor={authorChangeHandler}
          inputAuthor={inputAuthor}
          onSubmit={submitFormHandler}
        />
        <div className={styles.cards}>{books}</div>
        {totalPages > 1 && (
          <Pagination
            dataLength={dataLength}
            totalPages={totalPages}
            onClickPage={pageHandler}
            currentPage={currentPage}
            onClickPrev={prevHandler}
            onClickNext={nextHandler}
            maxPageNumberLimit={maxPageNumberLimit}
            minPageNumberLimit={minPageNumberLimit}
            gridStyle={styles.pagination}
          />
        )}
      </Grid>
    </section>
  );
};

export default Books;
