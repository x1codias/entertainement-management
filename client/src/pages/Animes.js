import { Fragment, useEffect, useState } from 'react';

import Card from '../components/Card';
import Grid from '../components/Grid';
import Search from '../components/Search';
import Pagination from '../components/Pagination';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';
import { useSearch } from '../hooks/search-hook';
import { useLocation } from 'react-router-dom';

const Animes = () => {
  const location = useLocation();
  const [loadedAnimes, setLoadedAnimes] = useState([]);
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
  } = usePagination('anime');

  useEffect(() => {
    const fetchAnimes = async () => {
      if (inputText === '') {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_KITSU_BASE_URL}anime?page[limit]=20&page[offset]=${offset}&sort=popularityRank`
          );

          console.log(responseData);

          setDataLength(responseData.meta.count);
          setTotalPages(Math.round((responseData.meta.count + 20 - 1) / 20));
          setLoadedAnimes(responseData.data);
        } catch (err) {}
      } else {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_KITSU_BASE_URL}anime?page[limit]=20&page[offset]=${offset}&sort=popularityRank&filter[text]=${inputText}`
          );

          console.log(responseData);

          setDataLength(responseData.meta.count);
          setTotalPages(Math.round((responseData.meta.count + 20 - 1) / 20));
          setLoadedAnimes(responseData.data);
        } catch (err) {}
      }
    };
    fetchAnimes();
  }, [sendRequest, inputText, setTotalPages, offset, setDataLength]);

  const animes = loadedAnimes.map((anime) => {
    return (
      <Card
        key={anime.id}
        page={location.pathname}
        id={anime.id}
        poster={anime.attributes.posterImage.original}
        title={anime.attributes.canonicalTitle}
        description={anime.attributes.description}
        isLoading={isLoading}
      />
    );
  });

  return (
    <Fragment>
      <Search onChange={changeHandler} initialValue={inputText} />
      <Grid>{animes}</Grid>
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

export default Animes;
