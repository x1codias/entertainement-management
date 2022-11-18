import { useState } from 'react';

export const usePagination = (type) => {
  let [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  let [pageNumberLimit] = useState(10);
  let [maxPageNumberLimit, setMaxPageNumberLimit] = useState(10);
  let [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  const [dataLength, setDataLength] = useState(0);
  const [offset, setOffset] = useState(0);
  const [resultsLimit] = useState(5);

  let pageHandler = (e) => {};

  let prevHandler = () => {};

  let nextHandler = () => {};

  if (type === 'movie' || type === 'show' || type === 'game') {
    pageHandler = (e) => {
      setCurrentPage(Number(e.target.id));
    };

    prevHandler = () => {
      setCurrentPage(currentPage - 1);

      if ((currentPage - 1) % pageNumberLimit === 0) {
        setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
      }
    };

    nextHandler = () => {
      setCurrentPage(currentPage + 1);

      if (currentPage + 1 > maxPageNumberLimit) {
        setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
      }
    };

    return {
      currentPage,
      totalPages,
      minPageNumberLimit,
      maxPageNumberLimit,
      dataLength,
      setDataLength,
      setTotalPages,
      pageHandler,
      prevHandler,
      nextHandler,
    };
  }

  if (type === 'anime' || type === 'book') {
    pageHandler = (e) => {
      setCurrentPage(Number(e.target.id));
      setOffset(currentPage * 20);
    };

    prevHandler = () => {
      setCurrentPage(currentPage - 1);
      setOffset(offset - 20);

      if ((currentPage - 1) % pageNumberLimit === 0) {
        setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
      }
    };

    nextHandler = () => {
      setCurrentPage(currentPage + 1);
      setOffset(offset + 20);

      if (currentPage + 1 > maxPageNumberLimit) {
        setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
        setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
      }
    };

    return {
      currentPage,
      totalPages,
      minPageNumberLimit,
      maxPageNumberLimit,
      offset,
      dataLength,
      setDataLength,
      setTotalPages,
      pageHandler,
      prevHandler,
      nextHandler,
    };
  }

  if (type === 'gallery') {
    const indexOfLastItem = currentPage * resultsLimit;
    const indexOfFirstItem = indexOfLastItem - resultsLimit;

    prevHandler = () => {
      setCurrentPage(currentPage - 1);
    };

    nextHandler = () => {
      setCurrentPage(currentPage + 1);
    };

    return {
      resultsLimit,
      indexOfFirstItem,
      indexOfLastItem,
      currentPage,
      prevHandler,
      nextHandler,
    };
  }
};
