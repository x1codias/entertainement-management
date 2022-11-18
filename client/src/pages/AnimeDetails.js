import { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const urlAnimeDetails = `${process.env.REACT_APP_KITSU_BASE_URL}anime/${id}`;
        const urlGenres = `${process.env.REACT_APP_KITSU_BASE_URL}anime/${id}/genres`;
        const urlStreamingLinks = `${process.env.REACT_APP_KITSU_BASE_URL}anime/${id}/streaming-links?include=streamer`;
        const urlEpisodes = `${process.env.REACT_APP_KITSU_BASE_URL}anime/${id}/episodes`;
        const urlCast = `${process.env.REACT_APP_KITSU_BASE_URL}anime/${id}/installments`;
        const urlCrew = `${process.env.REACT_APP_KITSU_BASE_URL}anime/${id}/anime-staff?include=person`;
        const urlCharacters = `${process.env.REACT_APP_KITSU_BASE_URL}anime/${id}/anime-characters?include=character`;
        //const urlInstallments = `${process.env.REACT_APP_KITSU_BASE_URL}installments`;

        const responseData = await sendRequest(urlAnimeDetails);
        const genresData = await sendRequest(urlGenres);
        const streamsData = await sendRequest(urlStreamingLinks);
        const episodesData = await sendRequest(urlEpisodes);
        const castData = await sendRequest(urlCast);
        const crewData = await sendRequest(urlCrew);
        const charactersData = await sendRequest(urlCharacters);
        //const installmentsData = await sendRequest(urlInstallments);

        console.log(responseData);
        console.log(genresData);
        console.log(streamsData);
        console.log(episodesData);
        console.log(castData);
        console.log(crewData);
        console.log(charactersData);
        //console.log(installmentsData);

        setLoadedAnime(responseData.data.attributes);
        setLoadedGenres(genresData.data);
        setLoadedStreams(streamsData.data);
        setLoadedEpisodes(episodesData.data);
        setLoadedCrew(crewData.data);
      } catch (err) {}
    };
    fetchAnime();
  }, [sendRequest, id]);

  const genres = loadedGenres.map((genre) => {
    return (
      <span
        key={genre.id}
        className={`${styles.details__genre} ${
          styles[`${genre.attributes.name.toLowerCase().split(' ').join('-')}`]
        }`}
      >
        {genre.attributes.name}
      </span>
    );
  });

  const streams = loadedStreams.map((stream) => {
    return (
      <span
        key={stream.id}
        className={`${styles.details__genre} ${
          styles[`${stream.attributes.url.toLowerCase().split(' ').join('-')}`]
        }`}
      >
        {stream.attributes.url.replaceAll('www', '.').split(/[/.]+/)[1]}
      </span>
    );
  });

  const episodes = laodedEpisodes.map((episode) => {
    return (
      <Card
        key={episode.id}
        episode
        image={episode.attributes.thumbnail.original}
        title={episode.attributes.canonicalTitle}
        description={episode.attributes.description}
        length={episode.attributes.length}
      />
    );
  });

  return (
    <Fragment>
      {isLoading && (
        <div className={styles.center}>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <section className={styles.details__container}>
          <div className={styles.details__img}>
            <img
              src={
                loadedAnime.coverImage === undefined
                  ? ''
                  : loadedAnime.coverImage.original
              }
              alt="Show"
            />
          </div>
          <h1 className={styles.details__title}>
            {loadedAnime.canonicalTitle}
          </h1>
          <h2>Overview</h2>
          <p className={styles.details__description}>
            {loadedAnime.description}
          </p>
          <div className={styles.container}>
            <div className={styles['container--small']}>
              <h2>Genres</h2>
              <div className={styles['container--genres']}>{genres}</div>
            </div>
            <div className={styles['container--small']}>
              <h2>Rating</h2>
              <span className={`${styles.details__rating} `}>
                {loadedAnime.averageRating}
              </span>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles['container--small']}>
              <h2>Available on</h2>
              <div className={styles.details__plataforms}>{streams}</div>
            </div>
            <div className={styles['container--small']}>
              <h2>Release Date</h2>
              <span className={styles.detailes__release}>
                {loadedAnime.startDate}
              </span>
            </div>
          </div>
          <h2>Episodes</h2>
          <div className={styles.details__episodes}>{episodes}</div>
          <h2>Cast</h2>

          <h2>Crew</h2>

          <h2>Trailer</h2>

          <h2>More like this</h2>
          <div className={styles.details__similar}></div>
        </section>
      )}
    </Fragment>
  );
};

export default AnimeDetails;
