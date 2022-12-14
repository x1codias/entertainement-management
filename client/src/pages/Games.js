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

import styles from './Games.module.css';
import gameCape from '../assets/game.jpg';
import { useFilter } from '../hooks/filter-hook';

const Games = () => {
  const location = useLocation();
  const [loadedGames, setLoadedGames] = useState([]);
  const [loadedGenres, setLoadedGenres] = useState([]);
  const {
    selectedOptions: selectedGenres,
    multipleCheckChangeHandler: genreChangeHandler,
  } = useFilter();
  const [loadedPlatforms, setLoadedPlatforms] = useState([]);
  const {
    selectedOptions: selectedPlatforms,
    multipleCheckChangeHandler: platformChangeHandler,
  } = useFilter();
  const { selectedDayRange, setSelectedDayRange } = useFilter();
  const [loadedStores, setLoadedStores] = useState([]);
  const {
    selectedOptions: selectedStores,
    multipleCheckChangeHandler: storeChangeHandler,
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
  } = usePagination('game');
  const urlRelevant = `${process.env.REACT_APP_RAWG_BASE_URL}games/lists/main?discover=true&ordering=-relevance&page_size=20&page=${currentPage}&key=${process.env.REACT_APP_RAWG_API_KEY}`;
  const urlPopular = `${process.env.REACT_APP_RAWG_BASE_URL}games/lists/main?discover=true&ordering=-rating&page_size=20&page=${currentPage}&key=${process.env.REACT_APP_RAWG_API_KEY}`;
  const urlTopRated = `${process.env.REACT_APP_RAWG_BASE_URL}games/lists/main?discover=true&ordering=-metacritic&page_size=20&page=${currentPage}&key=${process.env.REACT_APP_RAWG_API_KEY}`;
  const urlLatest = `${process.env.REACT_APP_RAWG_BASE_URL}games?ordering=-released&page=${currentPage}&key=${process.env.REACT_APP_RAWG_API_KEY}`;
  const urlUpcoming = `${process.env.REACT_APP_RAWG_BASE_URL}games?ordering=page=${currentPage}&key=${process.env.REACT_APP_RAWG_API_KEY}`;
  const { selectedSort, sortClickHandler } = useSort(
    urlRelevant,
    urlPopular,
    urlTopRated,
    urlLatest,
    urlUpcoming,
    setLoadedGames
  );

  useEffect(() => {
    const fetchGames = async () => {
      const urlGenres = `${process.env.REACT_APP_RAWG_BASE_URL}genres?key=${process.env.REACT_APP_RAWG_API_KEY}`;
      const urlPlatforms = `${process.env.REACT_APP_RAWG_BASE_URL}platforms?key=${process.env.REACT_APP_RAWG_API_KEY}`;
      const urlStores = `${process.env.REACT_APP_RAWG_BASE_URL}stores?key=${process.env.REACT_APP_RAWG_API_KEY}`;

      try {
        const genresData = await sendRequest(urlGenres);
        const platformsData = await sendRequest(urlPlatforms);
        const storesData = await sendRequest(urlStores);

        setLoadedGenres(genresData.results);
        setLoadedPlatforms(platformsData.results);
        setLoadedStores(storesData.results);
      } catch (err) {}

      if (inputText === '') {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_RAWG_BASE_URL}games?page=${currentPage}&key=${process.env.REACT_APP_RAWG_API_KEY}`
          );

          console.log(responseData);

          setDataLength(responseData.count);
          setTotalPages(Math.round((responseData.count + 20 - 1) / 20));
          setLoadedGames(responseData.results);
        } catch (err) {}
      } else {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_RAWG_BASE_URL}games?search=${inputText}&search_precise=true&page=${currentPage}&ordering=-metacritic,released&key=${process.env.REACT_APP_RAWG_API_KEY}`
          );

          setDataLength(responseData.count);
          setTotalPages(Math.round((responseData.count + 20 - 1) / 20));
          setLoadedGames(responseData.results);
        } catch (err) {}
      }
    };
    fetchGames();
  }, [sendRequest, inputText, currentPage, setDataLength, setTotalPages]);

  const games = loadedGames.map((game) => {
    return (
      <Card
        game
        key={game.id}
        page={location.pathname}
        id={game.id}
        poster={game.background_image ? game.background_image : gameCape}
        title={game.name}
        description={game.overview}
        isLoading={isLoading}
      />
    );
  });

  const submitFormHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const genres =
        selectedGenres && selectedGenres.length !== 0
          ? `&genres=${selectedGenres.join(',')}&`
          : '';
      const platforms =
        selectedPlatforms && selectedPlatforms.length !== 0
          ? `&platforms=${selectedPlatforms.join(',')}&`
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
          ? `&date=${fromDate}.${toDate}&`
          : '';

      const stores =
        selectedStores && selectedStores.length !== 0
          ? `&stores=${selectedStores.join(',')}&`
          : '';

      const url = `${process.env.REACT_APP_RAWG_BASE_URL}games?page=${currentPage}${genres}${platforms}${dateRange}${stores}key=${process.env.REACT_APP_RAWG_API_KEY}`;

      console.log(url);

      try {
        const responseData = await sendRequest(url);

        console.log(responseData);

        setLoadedGames(responseData.results);
      } catch (err) {}
    },
    [
      selectedDayRange,
      selectedGenres,
      selectedPlatforms,
      selectedStores,
      currentPage,
      sendRequest,
    ]
  );

  return (
    <section className={styles.games}>
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
          game
          onGenreChange={genreChangeHandler}
          genres={loadedGenres}
          onPlatformChange={platformChangeHandler}
          platforms={loadedPlatforms}
          calendarRange={selectedDayRange}
          onChangeCalendarRange={setSelectedDayRange}
          onStoreChange={storeChangeHandler}
          stores={loadedStores}
          onSubmit={submitFormHandler}
        />
        <div className={styles.cards}>{games}</div>
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

export default Games;
