import { Fragment, useEffect, useState } from 'react';

import Card from '../components/Card';
import Grid from '../components/Grid';
import Search from '../components/Search';
import Pagination from '../components/Pagination';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';
import { useSearch } from '../hooks/search-hook';
import { useLocation } from 'react-router-dom';

const Shows = () => {
  const location = useLocation();
  const [loadedShows, setLoadedShows] = useState([]);
  const { inputText, changeHandler } = useSearch();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const {
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
  } = usePagination('show');

  useEffect(() => {
    const fetchMovies = async () => {
      if (inputText === '') {
        const urlTrending = `${process.env.REACT_APP_TMDB_BASE_URL}3/trending/tv/week?page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        try {
          const responseData = await sendRequest(urlTrending);

          console.log(responseData);

          setDataLength(responseData.total_results);
          setTotalPages(responseData.total_pages);
          setLoadedShows(responseData.results);
        } catch (err) {}
      } else {
        const urlSearch = `${process.env.REACT_APP_TMDB_BASE_URL}3/search/tv/?query=${inputText}&page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        try {
          const responseData = await sendRequest(urlSearch);

          setDataLength(responseData.total_results);
          setTotalPages(responseData.total_pages);
          setLoadedShows(responseData.results);
        } catch (err) {}
      }
    };
    fetchMovies();
  }, [
    sendRequest,
    inputText,
    currentPage,
    totalPages,
    setTotalPages,
    setDataLength,
  ]);

  const shows = loadedShows.map((show) => {
    return (
      <Card
        key={show.id}
        page={location.pathname}
        id={show.id}
        poster={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
        title={show.name}
        description={show.overview}
        isLoading={isLoading}
      />
    );
  });

  return (
    <Fragment>
      <Search onChange={changeHandler} initialValue={inputText} />
      <Grid>{shows}</Grid>
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

export default Shows;
