import { Fragment, useEffect, useState } from 'react';

import Card from '../components/Card';
import Grid from '../components/Grid';
import Search from '../components/Search';
import { useHttpClient } from '../hooks/http-hook';
import { useSearch } from '../hooks/search-hook';
import { usePagination } from '../hooks/pagination-hook';
import Pagination from '../components/Pagination';

const Books = () => {
  const [loadedBooks, setLoadedBooks] = useState([]);
  const { inputText, changeHandler } = useSearch();
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

  const books = loadedBooks.map((book) => {
    return (
      <Card
        key={book.id}
        poster={
          book.volumeInfo.imageLinks === undefined
            ? ''
            : book.volumeInfo.imageLinks.thumbnail
        }
        title={book.volumeInfo.title}
        description={book.volumeInfo.description}
        isLoading={isLoading}
      />
    );
  });

  return (
    <Fragment>
      <Search onChange={changeHandler} initialValue={inputText} />
      {inputText === '' && <h1>Beginning typing to search for a book</h1>}
      <Grid>{books}</Grid>
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
        />
      )}
    </Fragment>
  );
};

export default Books;
