import { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Card from '../components/Card';
import Grid from '../components/Grid';
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';
import { useSearch } from '../hooks/search-hook';

// TODO: pagination on url

const Movies = () => {
  const location = useLocation();
  const [loadedMovies, setLoadedMovies] = useState([]);
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
  } = usePagination('movie');

  useEffect(() => {
    const fetchMovies = async () => {
      if (inputText === '') {
        const urlTrending = `${process.env.REACT_APP_TMDB_BASE_URL}3/trending/movie/week?page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        try {
          const responseData = await sendRequest(urlTrending);

          console.log(responseData);

          setDataLength(responseData.total_results);
          setTotalPages(responseData.total_pages);
          setLoadedMovies(responseData.results);
        } catch (err) {}
      } else {
        const urlSearch = `${process.env.REACT_APP_TMDB_BASE_URL}3/search/movie?query=${inputText}&page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        try {
          const responseData = await sendRequest(urlSearch);

          setDataLength(responseData.total_results);
          setTotalPages(responseData.total_pages);
          setLoadedMovies(responseData.results);
        } catch (err) {}
      }
    };
    fetchMovies();
  }, [sendRequest, inputText, currentPage, setTotalPages, setDataLength]);

  const movies = loadedMovies.map((movie) => {
    return (
      <Card
        key={movie.id}
        page={location.pathname}
        id={movie.id}
        poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        title={movie.title}
        description={movie.overview}
        isLoading={isLoading}
      />
    );
  });

  console.log(movies);

  return (
    <Fragment>
      <Search onChange={changeHandler} initialVaue={inputText} />
      <Grid>{movies}</Grid>
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

export default Movies;
