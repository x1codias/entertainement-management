import { Fragment, useEffect, useState } from 'react';

import Card from '../components/Card';
import Grid from '../components/Grid';
import Search from '../components/Search';
import Pagination from '../components/Pagination';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';
import { useSearch } from '../hooks/search-hook';
import { useLocation } from 'react-router-dom';

const Games = () => {
  const location = useLocation();
  const [loadedGames, setLoadedGames] = useState([]);
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
  } = usePagination('game');

  useEffect(() => {
    const fetchGames = async () => {
      if (inputText === '') {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_RAWG_BASE_URL}?page=${currentPage}&ordering=-metacritic,released&key=${process.env.REACT_APP_RAWG_API_KEY}`
          );

          console.log(responseData);

          setDataLength(responseData.count);
          setTotalPages(Math.round((responseData.count + 20 - 1) / 20));
          setLoadedGames(responseData.results);
        } catch (err) {}
      } else {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_RAWG_BASE_URL}?search=${inputText}&search_precise=true&page=${currentPage}&ordering=-metacritic,released&key=${process.env.REACT_APP_RAWG_API_KEY}`
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
        poster={game.background_image}
        title={game.name}
        description={game.overview}
        isLoading={isLoading}
      />
    );
  });

  return (
    <Fragment>
      <Search onChange={changeHandler} initialValue={inputText} />
      <Grid>{games}</Grid>
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

export default Games;
