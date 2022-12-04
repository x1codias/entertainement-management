import { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

import Gallery from '../components/Gallery';
import Pagination from '../components/Pagination';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Table from '../components/Table';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';

import styles from './AnimeDetails.module.css';

const AnimeDetails = () => {
  const { id } = useParams();
  const [loadedAnime, setLoadedAnime] = useState({});
  const [loadedGenres, setLoadedGenres] = useState([]);
  const [loadedStreams, setLoadedStreams] = useState([]);
  const [laodedEpisodes, setLoadedEpisodes] = useState([]);
  const [loadedCast, setLoadedCast] = useState([]);
  const [loadedCrew, setLoadedCrew] = useState([]);
  const [loadedInstallments, setLoadedInstallments] = useState([]);
  const [loadedCharacters, setLoadedCharacters] = useState([]);
  const { isLoading, error, sendRequest, sendRequestGraphQL, clearError } =
    useHttpClient();
  const {
    currentPage: currentPageCharacters,
    prevHandler: prevHandlerCharacters,
    nextHandler: nextHandlerCharacters,
  } = usePagination('gallery');
  const {
    currentPage: currentPageStaff,
    prevHandler: prevHandlerStaff,
    nextHandler: nextHandlerStaff,
  } = usePagination('gallery');
  const {
    currentPage: currentPageEpisode,
    prevHandler: prevHandlerEpisode,
    nextHandler: nextHandlerEpisode,
  } = usePagination('gallery');
  const {
    currentPage: currentPageSimilar,
    prevHandler: prevHandlerSimilar,
    nextHandler: nextHandlerSimilar,
  } = usePagination('gallery');

  const ANIME_QUERY = `
     query ($id: Int, $currentPageCharacters: Int, $currentPageStaff: Int, $currentPageEpisode: Int, $currentPageSimilar: Int) {
      Media(id: $id) {
        id,
        idMal,
        title {
          romaji,
          english
        },
        format,
        status,
        description,
        startDate {
          year,
          month,
          day
        },
        episodes,
        duration,
        trailer {
          id,
        },
        bannerImage,
        coverImage {
          extraLarge
        },
        genres,
        averageScore,
        tags {
          id,
          name,
          category
        },
        relations {
          edges {
            characterName
          },
        },
        characters(sort: FAVOURITES_DESC, page: $currentPageCharacters, perPage: 5) {
          edges {
            role,
            name
          },
          nodes {
            image {
              large,
              medium
            },
            description
          },
        },
        staff(page: $currentPageStaff, perPage: 5) {
          edges {
            id,
            role
          },
          nodes {
            name {
              full
            },
            image {
              large,
              medium
            },
            description,
          }
        },
        studios {
          nodes {
            name
          }
        },
        airingSchedule(page: $currentPageEpisode, perPage: 5) {
          nodes {
            id,
            airingAt,
            episode
          }
        },
        streamingEpisodes {
          title,
          thumbnail,
          site
        },
        recommendations(page: $currentPageSimilar, perPage: 5) {
          nodes {
            media {
              id,
              idMal,
              title {
                romaji,
                english
              },
              description,
              coverImage {
                extraLarge
              }
            }
          }
        }
      }
    }
  `;

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const aniListUrl = 'https://graphql.anilist.co/';

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            query: ANIME_QUERY,
            variables: {
              id: id,
              currentPageCharacters: currentPageCharacters,
              currentPageStaff: currentPageStaff,
              currentPageEpisode: currentPageEpisode,
              currentPageSimilar: currentPageSimilar,
            },
          }),
        };

        const anilistData = await sendRequestGraphQL(aniListUrl, options);

        console.log(anilistData);

        setLoadedAnime(anilistData);
        /*setLoadedGenres(genresData.data);
        setLoadedStreams(streamsData.data);
        setLoadedEpisodes(episodesData.data);
        setLoadedCrew(crewData.data);*/
      } catch (err) {}
    };
    fetchAnime();
  }, [
    sendRequestGraphQL,
    sendRequest,
    id,
    ANIME_QUERY,
    currentPageCharacters,
    currentPageStaff,
    currentPageEpisode,
    currentPageSimilar,
  ]);

  const totalRuntime =
    loadedAnime.data &&
    loadedAnime.data.Media.episodes * loadedAnime.data.Media.duration;

  const runtimeHours = Math.floor(totalRuntime / 60);
  const runtimeMinutes = totalRuntime % 60;

  const tags =
    loadedAnime.data &&
    loadedAnime.data.Media.tags.map((tag, index) => (
      <span key={index} className={styles.tag}>
        {tag.name}
      </span>
    ));

  const genres =
    loadedAnime.data &&
    loadedAnime.data.Media.genres.map((genre, index) => (
      <span
        key={index}
        className={`${styles.genre} ${
          styles[`${genre.toLowerCase().split(' ').join('-')}`]
        }`}
      >
        {genre}
      </span>
    ));

  const ratingScore = (rating) => {
    if (rating <= 34) {
      return 'very-bad';
    } else if (rating >= 35 && rating <= 49) {
      return 'bad';
    } else if (rating >= 50 && rating <= 64) {
      return 'mediocre';
    } else if (rating >= 65 && rating <= 79) {
      return 'good';
    } else {
      return 'very-good';
    }
  };

  const releaseDate =
    loadedAnime.data &&
    `${loadedAnime.data.Media.startDate.day}-${loadedAnime.data.Media.startDate.month}-${loadedAnime.data.Media.startDate.year}`;

  const studios =
    loadedAnime.data &&
    loadedAnime.data.Media.studios.nodes.map((studio, index) => (
      <span key={index} className={styles.studio}>
        {studio.name}
      </span>
    ));

  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedAnime.data && (
        <section className={styles.details}>
          <div className={styles.background}>
            <img
              src={
                loadedAnime.data.Media.bannerImage === undefined
                  ? loadedAnime.data.Media.coverImage.extraLarge
                  : loadedAnime.data.Media.bannerImage
              }
              alt="Background"
            />
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.details__title}>
                {loadedAnime.data.Media.title.romaji}
              </h1>
              <div className={styles.title__content}>
                <span className={styles.released}>
                  {loadedAnime.data.Media.status}
                </span>
                {loadedAnime.data.Media.episodes > 1 && (
                  <p>
                    <span className={styles.runtime}>
                      {loadedAnime.data.Media.episodes}
                    </span>
                    &nbsp; episodes
                  </p>
                )}
                <p>
                  <span className={styles.runtime}>
                    {runtimeHours !== 0 && <strong>{runtimeHours}h</strong>}
                    {runtimeMinutes !== 0 && <strong>{runtimeMinutes}m</strong>}
                  </span>
                  &nbsp; runtime
                </p>
              </div>
            </div>
            <div className={styles.tags}>{tags}</div>
            <h2>Overview</h2>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(loadedAnime.data.Media.description),
              }}
            />
            <div className={styles.container}>
              <div className={styles['container--small']}>
                <h2>Genres</h2>
                <div className={styles.genres}>{genres}</div>
              </div>
              <div className={styles['container--small']}>
                <h2>Rating</h2>
                <span
                  className={`${styles.rating} ${
                    styles[
                      `${ratingScore(loadedAnime.data.Media.averageScore)}`
                    ]
                  }`}
                >
                  {loadedAnime.data.Media.averageScore}
                </span>
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles['container--small']}>
                <h2>Available on</h2>
                <div className={styles.details__plataforms}></div>
              </div>
              <div className={styles['container--small']}>
                <h2>Release Date</h2>
                <span className={styles.released}>{releaseDate}</span>
              </div>
            </div>
            <h2>Studios</h2>
            <div className={styles.studios}>{studios}</div>

            <h2>Episodes</h2>
            <div className={styles.details__episodes}></div>
            <h2>Cast</h2>

            <h2>Crew</h2>

            <h2>Trailer</h2>

            <h2>More like this</h2>
            <div className={styles.details__similar}></div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

export default AnimeDetails;
