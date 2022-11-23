import { Fragment, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import LoadingSpinner from '../components/LoadingSpinner';
import Table from '../components/Table';
import Gallery from '../components/Gallery';
import Card from '../components/Card';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';
import Pagination from '../components/Pagination';

import styles from './MovieDetails.module.css';

const Details = () => {
  const { id } = useParams();
  const [loadedMovie, setLoadedMovie] = useState({});
  const [loadedCast, setLoadedCast] = useState([]);
  const [loadedCrew, setLoadedCrew] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const [loadedVideos, setLoadedVideos] = useState([]);
  const [loadedSimilar, setLoadedSimilar] = useState([]);
  const [loadedWatchProviders, setLoadedWatchProviders] = useState();
  const [totalResults, setTotalResults] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const {
    currentPage: currentPageVideo,
    prevHandler: prevHandlerVideo,
    nextHandler: nextHandlerVideo,
  } = usePagination('gallery');
  const {
    currentPage: currentPageImage,
    prevHandler: prevHandlerImage,
    nextHandler: nextHandlerImage,
  } = usePagination('gallery');
  const {
    currentPage: currentPageSimilar,
    prevHandler: prevHandlerSimilar,
    nextHandler: nextHandlerSimilar,
  } = usePagination('gallery');
  const {
    currentPage: currentPageCast,
    prevHandler: prevHandlerCast,
    nextHandler: nextHandlerCast,
  } = usePagination('gallery');
  const {
    currentPage: currentPageCrew,
    prevHandler: prevHandlerCrew,
    nextHandler: nextHandlerCrew,
  } = usePagination('gallery');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const urlMovieDetails = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlCastCrew = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlWatchProviders = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/watch/providers?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlImages = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/images?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlVideos = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlSimilar = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/similar?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

        const movieData = await sendRequest(urlMovieDetails);
        const castData = await sendRequest(urlCastCrew);
        const streamData = await sendRequest(urlWatchProviders);
        const imageData = await sendRequest(urlImages);
        const videoData = await sendRequest(urlVideos);
        const similarData = await sendRequest(urlSimilar);

        console.log(movieData);
        console.log(castData);
        console.log(streamData);
        console.log(imageData);
        console.log(videoData);
        console.log(similarData);

        setLoadedMovie(movieData);
        setLoadedCast(castData.cast);
        setLoadedCrew(castData.crew);
        setLoadedWatchProviders(streamData.results.PT);
        setLoadedImages(imageData.backdrops);
        setLoadedVideos(videoData.results);
        setLoadedSimilar(similarData.results);
        setTotalResults(similarData.total_results);
      } catch (err) {}
    };
    fetchMovie();
  }, [sendRequest, id]);

  let genres;

  if (loadedMovie.genres !== undefined) {
    genres = loadedMovie.genres.map((genre) => {
      return (
        <span
          key={genre.id}
          className={`${styles.details__genre} ${
            styles[`${genre.name.toLowerCase().split(' ').join('-')}`]
          }`}
        >
          {genre.name}
        </span>
      );
    });
  }

  const rating = Math.ceil(loadedMovie.vote_average * 10);

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
              alt="Platforms to buy movie"
            />
          </div>
        );
      });
    }
  }

  const getPaginatedDataImage = () => {
    const startIndex = currentPageImage * 5 - 5;
    const endIndex = startIndex + 5;
    return loadedImages.slice(startIndex, endIndex);
  };

  const getPaginatedDataVideo = () => {
    const startIndex = currentPageVideo * 5 - 5;
    const endIndex = startIndex + 5;
    return loadedVideos.slice(startIndex, endIndex);
  };

  const getPaginatedDataCast = () => {
    const startIndex = currentPageCast * 5 - 5;
    const endIndex = startIndex + 5;
    return loadedImages.slice(startIndex, endIndex);
  };

  const getPaginatedDataCrew = () => {
    const startIndex = currentPageCrew * 5 - 5;
    const endIndex = startIndex + 5;
    return loadedImages.slice(startIndex, endIndex);
  };

  const getPaginatedDataSimilar = () => {
    const startIndex = currentPageSimilar * 5 - 5;
    const endIndex = startIndex + 5;
    return loadedSimilar.slice(startIndex, endIndex);
  };

  const similarMovies =
    loadedSimilar &&
    getPaginatedDataSimilar() &&
    getPaginatedDataSimilar()[4].id !== loadedSimilar[19].id &&
    getPaginatedDataSimilar().map((movie, index) => {
      return (
        <Card
          key={index}
          page="/movies"
          id={movie.id}
          poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          title={movie.title}
          description={movie.overview}
          isLoading={isLoading}
        />
      );
    });

  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      <section className={styles.details}>
        <div className={styles.background}>
          <img
            src={`https://image.tmdb.org/t/p/original${loadedMovie.backdrop_path}`}
            alt="Game background"
          />
        </div>
        <div className={styles.content}>
          <h1 className={styles.details__title}>{loadedMovie.title}</h1>
          <h2>Overview</h2>
          <p className={styles.details__description}>{loadedMovie.overview}</p>
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
                {loadedMovie.release_date}
              </span>
            </div>
          </div>
          <h2>Cast</h2>
          <Table data={loadedCast} />
          <h2>Crew</h2>
          <Table data={loadedCrew} />
          <h2>Videos</h2>
          <Pagination
            gallery
            currentPage={currentPageVideo}
            numberOfPages={Math.ceil(loadedVideos.length / 5)}
            onClickPrev={prevHandlerVideo}
            onClickNext={nextHandlerVideo}
          >
            <Gallery video videos={getPaginatedDataVideo()} />
          </Pagination>
          <h2>Photos</h2>
          <Pagination
            gallery
            currentPage={currentPageImage}
            numberOfPages={Math.ceil(loadedImages.length / 5)}
            onClickPrev={prevHandlerImage}
            onClickNext={nextHandlerImage}
          >
            <Gallery image images={getPaginatedDataImage()} />
          </Pagination>
          <h2>More like this</h2>
          <Pagination
            gallery
            currentPage={currentPageSimilar}
            numberOfPages={Math.ceil(loadedSimilar / 5)}
            onClickNext={nextHandlerSimilar}
            onClickPrev={prevHandlerSimilar}
          >
            <div className={styles.details__similar}>{similarMovies}</div>
          </Pagination>
        </div>
      </section>
    </Fragment>
  );
};

export default Details;
