import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Card from '../components/Card';
import Filter from '../components/Filter';
import Grid from '../components/Grid';
import Pagination from '../components/Pagination';
import Search from '../components/Search';
import Sort from '../components/Sort';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';
import { useSearch } from '../hooks/search-hook';

import styles from './Movies.module.css';
import movieCape from '../assets/movie.jpg';
// TODO: pagination on url

const Movies = () => {
  const location = useLocation();
  const [loadedMovies, setLoadedMovies] = useState([]);
  const [selectedSort, setSelectedSort] = useState('');
  const [loadedGenres, setLoadedGenres] = useState([]);
  const [checkedGenres, setCheckedGenres] = useState([]);
  const [loadedCertifications, setLoadedCertifications] = useState([]);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null,
  });
  const [loadedStreams, setLoadedStreams] = useState([]);
  const [selectedStreams, setSelectedStreams] = useState([]);
  const { inputText, changeHandler } = useSearch();
  const { isLoading, sendRequest } = useHttpClient();
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
    firstPageHandler,
    lastPageHandler,
  } = usePagination('movie');

  useEffect(() => {
    const fetchMovies = async () => {
      const urlGenres = `${process.env.REACT_APP_TMDB_BASE_URL}3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
      const urlStreams = `${process.env.REACT_APP_TMDB_BASE_URL}3/watch/providers/movie?watch_region=PT&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
      const urlCertifications = `${process.env.REACT_APP_TMDB_BASE_URL}3/certification/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

      try {
        const genresData = await sendRequest(urlGenres);
        const streamsData = await sendRequest(urlStreams);
        const certificationsData = await sendRequest(urlCertifications);

        console.log(genresData);
        console.log(streamsData);
        console.log(certificationsData);

        setLoadedGenres(genresData.genres);
        setLoadedStreams(streamsData.results);
        setLoadedCertifications(certificationsData.certifications['US']);
      } catch (err) {}

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

          console.log(responseData);

          setDataLength(responseData.total_results);
          setTotalPages(responseData.total_pages);
          setLoadedMovies(responseData.results);
        } catch (err) {}
      }
    };
    fetchMovies();
  }, [sendRequest, inputText, currentPage, setTotalPages, setDataLength]);

  const sortClickHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setSelectedSort(e.target.outerText);
      console.log(selectedSort);

      const urlRelevant = `${process.env.REACT_APP_TMDB_BASE_URL}3/trending/movie/week?page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
      const urlPopular = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/popular?page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
      const urlTopRated = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/top_rated?page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
      const urlLatest = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/latest?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
      const urlUpcoming = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/upcoming?page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

      if (selectedSort === 'Relevance') {
        try {
          const relevantData = await sendRequest(urlRelevant);

          console.log(relevantData);

          setLoadedMovies(relevantData.results);
        } catch (err) {}
      }

      if (selectedSort === 'Popularity') {
        try {
          const popularData = await sendRequest(urlPopular);

          console.log(popularData);

          setLoadedMovies(popularData.results);
        } catch (err) {}
      }

      if (selectedSort === 'Rating') {
        try {
          const topRatedData = await sendRequest(urlTopRated);

          console.log(topRatedData);

          setLoadedMovies(topRatedData.results);
        } catch (err) {}
      }

      if (selectedSort === 'Latest') {
        try {
          const latestData = await sendRequest(urlLatest);

          console.log(latestData);

          setLoadedMovies(latestData.results);
        } catch (err) {}
      }

      if (selectedSort === 'Upcoming') {
        try {
          const upcomingData = await sendRequest(urlUpcoming);

          console.log(upcomingData);

          setLoadedMovies(upcomingData.results);
        } catch (err) {}
      }
    },
    [currentPage, selectedSort, sendRequest]
  );

  const genreChangeHandler = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    console.log(value, checked);
    if (checked) {
      setCheckedGenres([...checkedGenres, value]);
    } else {
      setCheckedGenres(checkedGenres.filter((e) => e !== value));
    }
  };

  const certificationChangeHandler = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    console.log(value, checked);
    if (checked) {
      setSelectedCertifications([...selectedCertifications, value]);
    } else {
      setSelectedCertifications(
        selectedCertifications.filter((e) => e !== value)
      );
    }
  };

  const streamChangeHandler = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    console.log(value, checked);
    if (checked) {
      setSelectedStreams([...selectedStreams, value]);
    } else {
      setSelectedStreams(selectedStreams.filter((e) => e !== value));
    }
  };

  const submitFormHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const genres =
        checkedGenres && checkedGenres.length !== 0
          ? `&with_genres=${checkedGenres.join(',')}&`
          : '';
      const certifications =
        selectedCertifications && selectedCertifications.length !== 0
          ? `&certification_country=US&certification=${selectedCertifications.join(
              ','
            )}&`
          : '';
      const toDate =
        selectedDayRange &&
        selectedDayRange.from !== null &&
        selectedDayRange.to !== null
          ? `${selectedDayRange.to.year}-${
              selectedDayRange.to.month < 10
                ? ('0' + selectedDayRange.to.month).slice(-2)
                : selectedDayRange.to.month
            }-${
              selectedDayRange.to.day < 10
                ? ('0' + selectedDayRange.to.day).slice(-2)
                : selectedDayRange.to.day
            }`
          : '';
      const fromDate =
        selectedDayRange &&
        selectedDayRange.from !== null &&
        selectedDayRange.to !== null
          ? `${selectedDayRange.from.year}-${
              selectedDayRange.from.month < 10
                ? ('0' + selectedDayRange.from.month).slice(-2)
                : selectedDayRange.from.month
            }-${
              selectedDayRange.from.day < 10
                ? ('0' + selectedDayRange.from.day).slice(-2)
                : selectedDayRange.from.day
            }`
          : '';
      const dateRange =
        selectedDayRange &&
        selectedDayRange.from !== null &&
        selectedDayRange.to !== null
          ? `&release_date.lte=${toDate}&release_date.gte=${fromDate}&`
          : '';

      const streams =
        selectedStreams && selectedStreams.length !== 0
          ? `&watch_region=PT&with_watch_providers=${selectedStreams.join(
              ','
            )}&`
          : '';

      const url = `${process.env.REACT_APP_TMDB_BASE_URL}3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}${genres}${certifications}${dateRange}${streams}page=${currentPage}`;

      console.log(url);

      try {
        const responseData = await sendRequest(url);

        console.log(responseData);

        setLoadedMovies(responseData.results);
      } catch (err) {}
    },
    [
      checkedGenres,
      currentPage,
      selectedCertifications,
      selectedDayRange,
      selectedStreams,
      sendRequest,
    ]
  );

  const movies =
    loadedMovies &&
    loadedMovies.map((movie) => {
      return (
        <Card
          key={movie.id}
          page={location.pathname}
          id={movie.id}
          poster={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : movieCape
          }
          title={movie.title}
          description={movie.overview}
          isLoading={isLoading}
        />
      );
    });

  return (
    <section className={styles.movies}>
      <Grid>
        <div className={styles.sort_search}>
          <Sort
            gridStyle={styles.sort}
            onClickSelected={sortClickHandler}
            selected={selectedSort}
          />
          <Search
            onChange={changeHandler}
            initialVaue={inputText}
            gridStyle={styles.search}
          />
        </div>
        <Filter
          movie
          onGenreChange={genreChangeHandler}
          genres={loadedGenres}
          onCertificationChange={certificationChangeHandler}
          certifications={loadedCertifications}
          calendarRange={selectedDayRange}
          onChangeCalendarRange={setSelectedDayRange}
          onStreamChange={streamChangeHandler}
          streams={loadedStreams}
          onSubmit={submitFormHandler}
        />
        <div className={styles.cards}>{movies}</div>
        {totalPages > 1 && (
          <Pagination
            dataLength={dataLength}
            totalPages={totalPages}
            onClickPage={pageHandler}
            currentPage={currentPage}
            onClickPrev={prevHandler}
            prevPage={currentPage - 1}
            onClickNext={nextHandler}
            nextPage={currentPage + 1}
            maxPageNumberLimit={maxPageNumberLimit}
            minPageNumberLimit={minPageNumberLimit}
            gridStyle={styles.pagination}
            onClickFirstPage={firstPageHandler}
            onClickLastPage={lastPageHandler}
          />
        )}
      </Grid>
    </section>
  );
};

export default Movies;
