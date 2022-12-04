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
  const { isLoading, error, sendRequestGraphQL, sendRequest, clearError } =
    useHttpClient();
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

  const ANIMES_QUERY = `
     query ($currentPage: Int) { 
      GenreCollection,
      Page(page: $currentPage, perPage: 20) {
        pageInfo {
          total,
          perPage,
          currentPage
        },
        media(type: ANIME, genre_not_in: ["hentai"], sort: TRENDING_DESC) {
          id,
          idMal,
          title {
            romaji,
            english,
            native
          },
          description(asHtml: true),
          coverImage{
            extraLarge,
            color
          },
        }
      }
    }
  `;

  const SEARCH_ANIMES_QUERY = `
     query ($currentPage: Int, $searchQry: String) { 
      Page(page: $currentPage, perPage: 20) {
        pageInfo {
          total,
          perPage,
          currentPage
        },
        media(type: ANIME, sort: TRENDING_DESC, genre_not_in: ["hentai"], search: $searchQry) {
          id,
          idMal,
          title {
            romaji,
            english,
            native
          },
          description,
          coverImage{
            extraLarge,
            color
          },
        }
      }
    }
  `;

  useEffect(() => {
    const fetchAnimes = async () => {
      const url = 'https://graphql.anilist.co';

      if (inputText === '') {
        try {
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              query: ANIMES_QUERY,
              variables: { currentPage: currentPage },
            }),
          };

          const anilistData = await sendRequestGraphQL(url, options);

          console.log(anilistData);

          setDataLength(anilistData.data.Page.pageInfo.total);
          setTotalPages(
            Math.round((anilistData.data.Page.pageInfo.total + 20 - 1) / 20)
          );
          setLoadedAnimes(anilistData.data.Page.media);
        } catch (err) {}
      } else {
        try {
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              query: SEARCH_ANIMES_QUERY,
              variables: { currentPage: currentPage, searchQry: inputText },
            }),
          };

          const anilistData = await sendRequestGraphQL(url, options);

          console.log(anilistData);

          setDataLength(anilistData.data.Page.pageInfo.total);
          setTotalPages(
            Math.round((anilistData.data.Page.pageInfo.total + 20 - 1) / 20)
          );
          setLoadedAnimes(anilistData.data.Page.media);
        } catch (err) {}
      }
    };
    fetchAnimes();
  }, [
    sendRequestGraphQL,
    inputText,
    setTotalPages,
    offset,
    setDataLength,
    ANIMES_QUERY,
    SEARCH_ANIMES_QUERY,
    currentPage,
  ]);

  const animes =
    loadedAnimes &&
    loadedAnimes.map((anime, index) => {
      return (
        <Card
          key={index}
          page={location.pathname}
          id={anime.id}
          poster={anime.coverImage.extraLarge}
          title={anime.title.romaji}
          anime
          description={anime.description}
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
