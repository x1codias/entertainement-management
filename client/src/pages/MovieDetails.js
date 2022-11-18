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
    const fetchMovie = async () => {
      try {
        const urlMovieDetails = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlMovieDetails);

        console.log(responseData);

        setLoadedMovie(responseData);
      } catch (err) {}
    };
    fetchMovie();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchMovieCast = async () => {
      try {
        const urlCastCrew = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlCastCrew);

        console.log(responseData);

        setLoadedCast(responseData.cast);
        setLoadedCrew(responseData.crew);
      } catch (err) {}
    };
    fetchMovieCast();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchMovieStreams = async () => {
      try {
        const urlWatchProviders = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/watch/providers?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlWatchProviders);

        console.log(responseData);

        setLoadedWatchProviders(responseData.results.PT);
      } catch (err) {}
    };
    fetchMovieStreams();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchMovieImages = async () => {
      try {
        const urlImages = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/images?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlImages);

        console.log(responseData);

        setLoadedImages(responseData.backdrops);
      } catch (err) {}
    };
    fetchMovieImages();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchMovieVideos = async () => {
      try {
        const urlVideos = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlVideos);

        console.log(responseData);

        setLoadedVideos(responseData.results);
      } catch (err) {}
    };
    fetchMovieVideos();
  }, [sendRequest, id]);

  useEffect(() => {
    const fetchMovieSimilars = async () => {
      try {
        const urlSimilar = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/similar?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const responseData = await sendRequest(urlSimilar);

        console.log(responseData);

        setLoadedSimilar(responseData.results);
      } catch (err) {}
    };
    fetchMovieSimilars();
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

  const currentImages = loadedImages.slice(indexOfFirstItem, indexOfLastItem);
  const currentVideos = loadedVideos.slice(indexOfFirstItem, indexOfLastItem);
  const numberOfPagesImages = Math.ceil(loadedImages / resultsLimit);
  const numberOfPagesVideos = Math.ceil(loadedVideos / resultsLimit);

  const similarMovies = loadedSimilar.map((movie) => {
    return (
      <Card
        key={movie.id}
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
      <div className={styles.center}>{isLoading && <LoadingSpinner />}</div>
      <section className={styles.details__container}>
        <div className={styles.details__img}>
          <img
            src={`https://image.tmdb.org/t/p/original${loadedMovie.backdrop_path}`}
            alt="Movie"
          />
        </div>
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
        <div className={styles.details__similar}>{similarMovies}</div>
      </section>
    </Fragment>
  );
};

export default Details;
