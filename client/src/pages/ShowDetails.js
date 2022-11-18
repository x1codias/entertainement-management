import { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Gallery from '../components/Gallery';
import Pagination from '../components/Pagination';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Table from '../components/Table';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';

import styles from './ShowDetails.module.css';

const ShowDetails = () => {
  const { id } = useParams();
  const [loadedShow, setLoadedShow] = useState({});
  const [loadedCast, setLoadedCast] = useState([]);
  const [loadedCrew, setLoadedCrew] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const [loadedVideos, setLoadedVideos] = useState([]);
  const [loadedSimilar, setLoadedSimilar] = useState([]);
  const [loadedWatchProviders, setLoadedWatchProviders] = useState([]);
  const [season, setSeason] = useState(0);
  const [episode, setEpisode] = useState(1);
  const [loadedSeason, setLoadedSeason] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const {
    resultsLimit,
    indexOfFirstItem,
    indexOfLastItem,
    currentPage,
    prevHandler,
    nextHandler,
  } = usePagination('gallery');

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const urlShowDetails = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlShowDetails);

        console.log(responseData);

        setLoadedShow(responseData);
      } catch (err) {}
    };
    fetchShow();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchShowCast = async () => {
      try {
        const urlCastCrew = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlCastCrew);

        console.log(responseData);

        setLoadedCast(responseData.cast);
        setLoadedCrew(responseData.crew);
      } catch (err) {}
    };
    fetchShowCast();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchShowStreams = async () => {
      try {
        const urlWatchProviders = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/watch/providers?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlWatchProviders);

        console.log(responseData);

        setLoadedWatchProviders(responseData.results.PT);
      } catch (err) {}
    };
    fetchShowStreams();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchShowImages = async () => {
      try {
        const urlImages = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/images?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlImages);

        console.log(responseData);

        setLoadedImages(responseData.backdrops);
      } catch (err) {}
    };
    fetchShowImages();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchShowVideos = async () => {
      try {
        const urlVideos = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlVideos);

        console.log(responseData);

        setLoadedVideos(responseData.results);
      } catch (err) {}
    };
    fetchShowVideos();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchShowSimilars = async () => {
      try {
        const urlSimilar = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/similar?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlSimilar);

        console.log(responseData);

        setLoadedSimilar(responseData.results);
      } catch (err) {}
    };
    fetchShowSimilars();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchShowEpisodes = async () => {
      try {
        const urlEpisodes = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/season/${season}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlEpisodes);

        console.log(responseData);

        setLoadedSeason(responseData);
      } catch (err) {}
    };
    fetchShowEpisodes();
  }, [sendRequest, id, season]);

  let genres;

  if (loadedShow.genres !== undefined) {
    genres = loadedShow.genres.map((genre) => {
      return (
        <span
          key={genre.id}
          className={`${styles.details__genre} ${
            styles[
              `${genre.name
                .toLowerCase()
                .split('&')
                .join('-')
                .replace(/\s/g, '')}`
            ]
          }`}
        >
          {genre.name}
        </span>
      );
    });
  }

  const rating = Math.ceil(loadedShow.vote_average * 10);

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

  let streaming;
  let buy;

  if (loadedWatchProviders !== undefined) {
    if (loadedWatchProviders.flatrate !== undefined) {
      streaming = loadedWatchProviders.flatrate.map((service) => {
        return (
          <div className={styles.details__plataform}>
            <img
              src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
              alt="Streaming service"
            />
          </div>
        );
      });
    }

    if (loadedWatchProviders.buy !== undefined) {
      buy = loadedWatchProviders.buy.map((service) => {
        return (
          <div className={styles.details__plataform}>
            <img
              src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
              alt="Platforms to buy Show"
            />
          </div>
        );
      });
    }
  }

  const currentImages = loadedImages.slice(indexOfFirstItem, indexOfLastItem);
  const currentVideos = loadedVideos.slice(indexOfFirstItem, indexOfLastItem);
  const numberOfPagesImages = Math.ceil(loadedImages / resultsLimit);
  const numberOfPagesVideos = Math.ceil(loadedVideos / resultsLimit);

  const similarShows = loadedSimilar.map((Show) => {
    return (
      <Card
        key={Show.id}
        page="/Shows"
        id={Show.id}
        poster={`https://image.tmdb.org/t/p/w500${Show.poster_path}`}
        title={Show.title}
        description={Show.overview}
        isLoading={isLoading}
      />
    );
  });

  let options;

  if (loadedShow.seasons !== undefined) {
    options = loadedShow.seasons.map((season, index) => {
      return <option key={index}>{season.name}</option>;
    });
  }

  const onChangeSeasonHandler = (e) => {
    e.preventDefault();
    setSeason(e.target.value);
  };

  let episodes;
  const episodeScores = [];

  if (loadedSeason !== undefined) {
    if (loadedSeason.episodes !== undefined) {
      episodes = loadedSeason.episodes.map((episode) => {
        episodeScores.push(episode.vote_average);

        return (
          <Card
            episode
            image={`https://image.tmdb.org/t/p/original${episode.still_path}`}
            title={episode.title}
            description={episode.overview}
            score={episode.vote_average}
          />
        );
      });
    }
  }

  const seasonScore = () => {
    const sum = episodeScores.reduce((prev, curr) => prev + curr, 0);
    return loadedSeason.episodes && sum / loadedSeason.episodes.length;
  };

  return (
    <Fragment>
      <div className={styles.center}>{isLoading && <LoadingSpinner />}</div>
      <section className={styles.details__container}>
        <div className={styles.details__img}>
          <img
            src={`https://image.tmdb.org/t/p/original${loadedShow.backdrop_path}`}
            alt="Show"
          />
        </div>
        <h1 className={styles.details__title}>{loadedShow.title}</h1>
        <h2>Overview</h2>
        <p className={styles.details__description}>{loadedShow.overview}</p>
        <div className={styles.container}>
          <div className={styles['container--small']}>
            <h2>Genres</h2>
            <div className={styles['container--genres']}>{genres}</div>
          </div>
          <div className={styles['container--small']}>
            <h2>Rating</h2>
            <span
              className={`${styles.details__rating} ${
                styles[ratingScore(rating)]
              }`}
            >
              {rating}
            </span>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles['container--small']}>
            <h2>Available on</h2>
            <div className={styles.details__plataforms}>
              {streaming} {buy}
            </div>
          </div>
          <div className={styles['container--small']}>
            <h2>Release Date</h2>
            <span className={styles.detailes__release}>
              {loadedShow.first_air_date}
            </span>
          </div>
        </div>
        <h2>Seasons and Episodes</h2>
        <select onChange={onChangeSeasonHandler}>{options}</select>
        <span>{seasonScore()}</span>
        {episodes}
        <div className={styles.details__episodes}></div>
        <h2>Cast</h2>
        <Table data={loadedCast} />
        <h2>Crew</h2>
        <Table data={loadedCrew} />
        <h2>Videos</h2>
        <Pagination
          gallery
          currentPage={currentPage}
          numberOfPages={numberOfPagesVideos}
          onClickPrev={prevHandler}
          onClickNext={nextHandler}
        >
          <Gallery video videos={currentVideos} key={loadedVideos.id} />
        </Pagination>
        <h2>Photos</h2>
        <Pagination
          gallery
          currentPage={currentPage}
          numberOfPages={numberOfPagesImages}
          onClickPrev={prevHandler}
          onClickNext={nextHandler}
        >
          <Gallery image images={currentImages} key={loadedImages.id} />
        </Pagination>
        <h2>More like this</h2>
        <div className={styles.details__similar}>{similarShows}</div>
      </section>
    </Fragment>
  );
};

export default ShowDetails;
