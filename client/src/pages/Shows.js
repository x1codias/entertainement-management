import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import Card from '../components/Card';
import Grid from '../components/Grid';
import Search from '../components/Search';
import Pagination from '../components/Pagination';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';
import { useSearch } from '../hooks/search-hook';
import Sort from '../components/Sort';
import Filter from '../components/Filter';

import styles from './Shows.module.css';
import showCape from '../assets/show.jpg';

const Shows = () => {
  const location = useLocation();
  const [loadedShows, setLoadedShows] = useState([]);
  const [selectedSort, setSelectedSort] = useState();
  const [loadedGenres, setLoadedGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loadedCertifications, setLoadedCertifications] = useState([]);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null,
  });
  const [loadedStreams, setLoadedStreams] = useState([]);
  const [selectedStreams, setSelectedStreams] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
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

  const sortChangeHandler = (e) => {
    setSelectedSort(e.target.value);
  };

  const genreChangeHandler = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    console.log(value, checked);
    if (checked) {
      setSelectedGenres([...selectedGenres, value]);
    } else {
      setSelectedGenres(selectedGenres.filter((e) => e !== value));
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

  const stateChangeHandler = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    console.log(value, checked);
    if (checked) {
      setSelectedStates([...selectedStates, value]);
    } else {
      setSelectedStates(selectedStates.filter((e) => e !== value));
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
        selectedGenres && selectedGenres.length !== 0
          ? `&with_genres=${selectedGenres.join(',')}&`
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
      selectedCertifications,
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
          <Sort gridStyle={styles.sort} />
          <Search
            onChange={changeHandler}
            initialValue={inputText}
            gridStyle={styles.search}
          />
        </div>
        <Filter
          show
          onSortChange={sortChangeHandler}
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
          />
        )}
      </Grid>
    </section>
  );
};

export default Shows;
