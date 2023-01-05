import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import Card from '../components/Card';
import Grid from '../components/Grid';
import Search from '../components/Search';
import Pagination from '../components/Pagination';
import Sort from '../components/Sort';
import Filter from '../components/Filter';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';
import { useSearch } from '../hooks/search-hook';
import { useSort } from '../hooks/sort-hook';
import { useFilter } from '../hooks/filter-hook';

import styles from './Shows.module.css';
import showCape from '../assets/show.jpg';

const Shows = () => {
  const location = useLocation();
  const [loadedShows, setLoadedShows] = useState([]);
  const [loadedGenres, setLoadedGenres] = useState([]);
  const {
    selectedOptions: selectedGenres,
    multipleCheckChangeHandler: genreChangeHandler,
  } = useFilter();
  const [loadedCertifications, setLoadedCertifications] = useState([]);
  const {
    selectedOption: selectedCertification,
    checkChangeHandler: certificationChangeHandler,
  } = useFilter();
  const { selectedDayRange, setSelectedDayRange } = useFilter();
  const [loadedStreams, setLoadedStreams] = useState([]);
  const {
    selectedOptions: selectedStreams,
    multipleCheckChangeHandler: streamChangeHandler,
  } = useFilter();
  const {
    selectedOptions: selectedStates,
    multipleCheckChangeHandler: stateChangeHandler,
  } = useFilter();
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
  } = usePagination('show');
  const today = new Date();
  const urlRelevant = `${process.env.REACT_APP_TMDB_BASE_URL}3/trending/tv/week?page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
  const urlPopular = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/popular?page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
  const urlTopRated = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/top_rated?page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
  const urlLatest = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/on_the_air?page=${currentPage}&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
  const urlUpcoming = `${
    process.env.REACT_APP_TMDB_BASE_URL
  }3/discover/tv?first_air_date.gte=${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}&page=${currentPage}&page=${currentPage}&api_key=${
    process.env.REACT_APP_TMDB_API_KEY
  }`;
  const { selectedSort, sortClickHandler } = useSort(
    urlRelevant,
    urlPopular,
    urlTopRated,
    urlLatest,
    urlUpcoming,
    setLoadedShows
  );

  useEffect(() => {
    const fetchMovies = async () => {
      const urlGenres = `${process.env.REACT_APP_TMDB_BASE_URL}3/genre/tv/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
      const urlStreams = `${process.env.REACT_APP_TMDB_BASE_URL}3/watch/providers/tv?watch_region=PT&api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
      const urlCertifications = `${process.env.REACT_APP_TMDB_BASE_URL}3/certification/tv/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

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

  const submitFormHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const genres =
        selectedGenres && selectedGenres.length !== 0
          ? `&with_genres=${selectedGenres.join(',')}&`
          : '';
      const certifications = selectedCertification
        ? `&certification_country=US&certification=${selectedCertification}&`
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

      const states =
        selectedStates && selectedStates.length !== 0
          ? `&with_status=${selectedStates.join(',')}&`
          : '';

      const url = `${process.env.REACT_APP_TMDB_BASE_URL}3/discover/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}${genres}${certifications}${dateRange}${streams}${states}page=${currentPage}`;

      console.log(url);

      try {
        const responseData = await sendRequest(url);

        console.log(responseData);

        setLoadedShows(responseData.results);
      } catch (err) {}
    },
    [
      selectedGenres,
      currentPage,
      selectedCertification,
      selectedDayRange,
      selectedStreams,
      selectedStates,
      sendRequest,
    ]
  );

  const shows = loadedShows.map((show) => {
    return (
      <Card
        key={show.id}
        page={location.pathname}
        id={show.id}
        poster={
          show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : showCape
        }
        title={show.name}
        description={show.overview}
        isLoading={isLoading}
      />
    );
  });

  return (
    <section className={styles.shows}>
      <Grid>
        <div className={styles.sort_search}>
          <Sort
            gridStyle={styles.sort}
            onClickSelected={sortClickHandler}
            selected={selectedSort}
          />
          <Search
            onChange={changeHandler}
            initialValue={inputText}
            gridStyle={styles.search}
          />
        </div>
        <Filter
          show
          onGenreChange={genreChangeHandler}
          genres={loadedGenres}
          onCertificationChange={certificationChangeHandler}
          certifications={loadedCertifications}
          onStateChange={stateChangeHandler}
          onChangeCalendarRange={setSelectedDayRange}
          calendarRange={selectedDayRange}
          onStreamChange={streamChangeHandler}
          streams={loadedStreams}
          onSubmit={submitFormHandler}
        />
        <div className={styles.cards}>{shows}</div>
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
            onClickFirstPage={firstPageHandler}
            onClickLastPage={lastPageHandler}
            prevPage={currentPage - 1}
            nextPage={currentPage + 1}
          />
        )}
      </Grid>
    </section>
  );
};

export default Shows;
