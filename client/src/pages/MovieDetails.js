import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { SiAppletv, SiRakuten, SiHbo } from 'react-icons/si';
import {
  FaGooglePlay,
  FaYoutube,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa';
import { RiNetflixFill } from 'react-icons/ri';
import { BsBookmarkPlus, BsBookmarkDash } from 'react-icons/bs';
import { TbHeart, TbHeartOff } from 'react-icons/tb';

import LoadingSpinner from '../components/LoadingSpinner';
import Gallery from '../components/Gallery';
import Card from '../components/Card';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';
import Pagination from '../components/Pagination';

import styles from './MovieDetails.module.css';
import avatar from '../assets/istockphoto-1337144146-170667a.jpg';
import { AuthContext } from '../context/auth-context';

const MovieDetails = () => {
  const auth = useContext(AuthContext);
  const { id } = useParams();
  const [loadedMovie, setLoadedMovie] = useState({});
  const [loadedCast, setLoadedCast] = useState([]);
  const [loadedCrew, setLoadedCrew] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const [loadedVideos, setLoadedVideos] = useState([]);
  const [loadedSimilar, setLoadedSimilar] = useState([]);
  const [loadedWatchProviders, setLoadedWatchProviders] = useState([]);
  const [loadedKeywords, setLoadedKeywords] = useState([]);
  const [myFavorites, setMyFavorites] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [toWatchMovies, setToWatchMovies] = useState([]);
  const [backendMovies, setBackendMovies] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();
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
      const userData = JSON.parse(localStorage.getItem('userData'));
      try {
        const urlMovieDetails = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlCastCrew = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlWatchProviders = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/watch/providers?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlImages = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/images?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlVideos = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlSimilar = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/similar?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlKeywords = `${process.env.REACT_APP_TMDB_BASE_URL}3/movie/${id}/keywords?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlBackendMovies = `http://localhost:5000/api/movies/`;
        const urlMyFavoriteMovies = `http://localhost:5000/api/users/${userData.username}/favorite`;
        const urlStatusMovies = `http://localhost:5000/api/users/${userData.username}/status`;

        const movieData = await sendRequest(urlMovieDetails);
        const castData = await sendRequest(urlCastCrew);
        const streamData = await sendRequest(urlWatchProviders);
        const imageData = await sendRequest(urlImages);
        const videoData = await sendRequest(urlVideos);
        const similarData = await sendRequest(urlSimilar);
        const keywordsData = await sendRequest(urlKeywords);
        const backendMoviesData = await sendRequest(urlBackendMovies);
        if (auth.isLoggedIn) {
          const myFavoriteMoviesData = await sendRequest(
            urlMyFavoriteMovies,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            }
          );
          const statusMoviesData = await sendRequest(
            urlStatusMovies,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            }
          );

          console.log(myFavoriteMoviesData.favMovies);
          console.log(statusMoviesData);
          myFavoriteMoviesData &&
            setMyFavorites(myFavoriteMoviesData.favMovies);
          statusMoviesData != null &&
            setWatchedMovies(statusMoviesData.watchedMovies);
          statusMoviesData != null &&
            setToWatchMovies(statusMoviesData.toWatchMovies);
        }

        console.log(movieData);
        console.log(castData);
        console.log(streamData);
        console.log(imageData);
        console.log(videoData);
        console.log(similarData);
        console.log(keywordsData);
        console.log(backendMoviesData);

        setLoadedMovie(movieData);
        setLoadedCast(castData.cast);
        setLoadedCrew(castData.crew);
        setLoadedWatchProviders(streamData.results.PT);
        setLoadedImages(imageData.backdrops);
        setLoadedVideos(videoData.results);
        setLoadedSimilar(similarData.results);
        setLoadedKeywords(keywordsData.keywords);
        setBackendMovies(backendMoviesData.movies);
      } catch (err) {}
    };
    fetchMovie();
  }, [sendRequest, id, auth]);

  const addToFavoritesHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userData'));
      const newMovie = {
        movieId: loadedMovie.id,
        title: loadedMovie.original_title,
        description: loadedMovie.overview,
        image: loadedMovie.poster_path,
      };

      const movieToAdd = {
        movieId: loadedMovie.id,
      };

      const urlCreateMovie = `http://localhost:5000/api/movies`;
      const urlAddMovieToFavorite = `http://localhost:5000/api/users/${userData.userId}/favorite`;

      if (
        backendMovies &&
        !backendMovies.some((movie) => loadedMovie.id === movie.movieId)
      ) {
        await sendRequest(urlCreateMovie, 'POST', JSON.stringify(newMovie), {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        });
      }

      await sendRequest(
        urlAddMovieToFavorite,
        'POST',
        JSON.stringify(movieToAdd),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    },
    [loadedMovie, backendMovies, auth, sendRequest]
  );

  const removeFromFavoritesHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userData'));

      const urlRemoveFromFavorite = `http://localhost:5000/api/users/${userData.userId}/favorite/${loadedMovie.id}`;

      await sendRequest(urlRemoveFromFavorite, 'PATCH', null, {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token,
      });
    },
    [loadedMovie, auth, sendRequest]
  );

  const addToWatchedListHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userData'));
      const newMovie = {
        movieId: loadedMovie.id,
        title: loadedMovie.original_title,
        description: loadedMovie.overview,
        image: loadedMovie.poster_path,
      };

      const urlCreateMovie = `http://localhost:5000/api/movies`;
      const urlAddMovieToWatched = `http://localhost:5000/api/users/${userData.userId}/status`;

      if (
        backendMovies &&
        backendMovies.some((movie) => loadedMovie.id === movie.movieId)
      ) {
        await sendRequest(urlCreateMovie, 'POST', JSON.stringify(newMovie), {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        });
      }
      await sendRequest(
        urlAddMovieToWatched,
        'POST',
        JSON.stringify({ movieId: newMovie.movieId, statusValue: 'done' }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    },
    [loadedMovie, backendMovies, auth, sendRequest]
  );

  const removeFromWatchedListHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userData'));

      const urlRemoveFromWatchedList = `http://localhost:5000/api/users/${userData.userId}/status/${loadedMovie.id}`;

      await sendRequest(
        urlRemoveFromWatchedList,
        'PATCH',
        JSON.stringify({ statusValue: 'done' }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    },
    [loadedMovie, auth, sendRequest]
  );

  const addToWatchListHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userData'));
      const newMovie = {
        movieId: loadedMovie.id,
        title: loadedMovie.original_title,
        description: loadedMovie.overview,
        image: loadedMovie.poster_path,
      };

      const urlCreateMovie = `http://localhost:5000/api/movies`;
      const urlAddMovieToWatchList = `http://localhost:5000/api/users/${userData.userId}/status`;

      if (
        backendMovies &&
        backendMovies.some((movie) => loadedMovie.id === movie.movieId)
      ) {
        await sendRequest(urlCreateMovie, 'POST', JSON.stringify(newMovie), {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        });
      }

      await sendRequest(
        urlAddMovieToWatchList,
        'POST',
        JSON.stringify({ movieId: newMovie.movieId, statusValue: 'to_do' }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    },
    [loadedMovie, auth, backendMovies, sendRequest]
  );

  const removeFromWatchListHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userData'));

      const urlRemoveFromWatchList = `http://localhost:5000/api/users/${userData.userId}/status/${loadedMovie.id}`;

      await sendRequest(
        urlRemoveFromWatchList,
        'PATCH',
        JSON.stringify({ statusValue: 'to_do' }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    },
    [loadedMovie, auth, sendRequest]
  );

  const platforms =
    loadedWatchProviders &&
    loadedWatchProviders.flatrate &&
    loadedWatchProviders.flatrate.map((platform, index) => {
      return (
        <span key={index} className={styles.platform}>
          <IconContext.Provider value={{ size: '3rem' }}>
            {platform.provider_name.includes('Disney') && (
              <span className={styles.disney}>Disney +</span>
            )}
            {platform.provider_name.includes('Youtube') && <FaYoutube />}
            {platform.provider_name.includes('Google') && <FaGooglePlay />}
            {platform.provider_name.includes('Rakuten') && <SiRakuten />}
            {platform.provider_name.includes('HBO') && <SiHbo />}
            {platform.provider_name.includes('Netflix') && <RiNetflixFill />}
            {platform.provider_name.includes('Apple') && <SiAppletv />}
          </IconContext.Provider>
        </span>
      );
    });

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

  const prodCompanies =
    loadedMovie &&
    loadedMovie.production_companies &&
    loadedMovie.production_companies.map((proComp, index) => {
      return (
        <span key={index} className={styles.company}>
          {proComp.name}
        </span>
      );
    });

  const tags =
    loadedKeywords &&
    loadedKeywords.map((tag, index) => (
      <span key={index} className={styles.tag}>
        {tag.name}
      </span>
    ));

  const getPaginatedData = (currentPage, data) => {
    const startIndex = currentPage * 5 - 5;
    const endIndex = startIndex + 5;
    return data.slice(startIndex, endIndex);
  };

  const similarMovies =
    getPaginatedData(currentPageSimilar, loadedSimilar) &&
    loadedSimilar &&
    getPaginatedData(currentPageSimilar, loadedSimilar).map((movie, index) => {
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

  const cast =
    getPaginatedData(currentPageCast, loadedCast) &&
    getPaginatedData(currentPageCast, loadedCast).map((person, index) => {
      return (
        <Card
          key={index}
          creator
          jobCharacter={person.character}
          background={`https://image.tmdb.org/t/p/original${loadedMovie.poster_path}`}
          photo={
            person.profile_path !== null
              ? `https://image.tmdb.org/t/p/original${person.profile_path}`
              : avatar
          }
          name={person.original_name}
        />
      );
    });

  const crew =
    getPaginatedData(currentPageCrew, loadedCrew) &&
    getPaginatedData(currentPageCrew, loadedCrew).map((person, index) => {
      return (
        <Card
          key={index}
          creator
          jobCharacter={person.job}
          background={`https://image.tmdb.org/t/p/original${loadedMovie.backdrop_path}`}
          photo={
            person.profile_path !== null
              ? `https://image.tmdb.org/t/p/original${person.profile_path}`
              : avatar
          }
          name={person.original_name}
        />
      );
    });

  const runtimeHours = Math.floor(loadedMovie.runtime / 60);
  const runtimeMinutes = loadedMovie.runtime % 60;

  const movieInFavList =
    myFavorites &&
    myFavorites.some((favMovie) => favMovie.movieId === loadedMovie.id);

  const movieInWatchedList =
    watchedMovies &&
    watchedMovies.some((watched) => watched.movieId === loadedMovie.id);

  const movieInWatchList =
    toWatchMovies &&
    toWatchMovies.some((toWatch) => toWatch.movieId === loadedMovie.id);

  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      <section className={styles.details}>
        <div className={styles.background}>
          <img
            src={`https://image.tmdb.org/t/p/original${loadedMovie.backdrop_path}`}
            alt="Movie background"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.platforms}>{platforms}</div>
            <h1 className={styles.details__title}>{loadedMovie.title}</h1>
            <h2 className={styles.subtitle}>{loadedMovie.tagline}</h2>
            <div className={styles.title__content}>
              <span className={styles.released}>
                {loadedMovie.release_date}
              </span>
              <p>
                <span className={styles.runtime}>
                  {runtimeHours !== 0 && <strong>{runtimeHours}h</strong>}
                  {runtimeMinutes !== 0 && <strong>{runtimeMinutes}m</strong>}
                </span>
              </p>
              {auth.isLoggedIn && (
                <div className={styles['title__btn--group']}>
                  <button
                    onClick={
                      !movieInWatchedList
                        ? addToWatchedListHandler
                        : removeFromWatchedListHandler
                    }
                    className={styles['title__btn']}
                    title="Add movie to watched list"
                  >
                    <IconContext.Provider
                      value={{
                        size: '2.5rem',
                        className: `${styles['title__btn--icon']}`,
                      }}
                    >
                      {!movieInWatchedList ? <FaRegEye /> : <FaRegEyeSlash />}
                    </IconContext.Provider>
                  </button>
                  <button
                    onClick={
                      !movieInFavList
                        ? addToFavoritesHandler
                        : removeFromFavoritesHandler
                    }
                    className={styles['title__btn']}
                    title="Add movie to favorites list"
                  >
                    <IconContext.Provider
                      value={{
                        size: '2.5rem',
                        className: `${styles['title__btn--icon']}`,
                      }}
                    >
                      {!movieInFavList ? <TbHeart /> : <TbHeartOff />}
                    </IconContext.Provider>
                  </button>
                  <button
                    onClick={
                      !movieInWatchList
                        ? addToWatchListHandler
                        : removeFromWatchListHandler
                    }
                    className={styles['title__btn']}
                    title="Add movie to watch list"
                  >
                    <IconContext.Provider
                      value={{
                        size: '2.5rem',
                        className: `${styles['title__btn--icon']}`,
                      }}
                    >
                      {!movieInWatchList ? (
                        <BsBookmarkPlus />
                      ) : (
                        <BsBookmarkDash />
                      )}
                    </IconContext.Provider>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.tags}>{tags}</div>
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
                {streaming === undefined && buy === undefined && (
                  <p>Not available in any streaming platform yet.</p>
                )}{' '}
                {streaming} {buy}
              </div>
            </div>
            <div className={styles['container--small']}>
              <h2>Release Date</h2>
              <span className={styles.released}>
                {loadedMovie.release_date}
              </span>
            </div>
          </div>
          <div className={styles['container--small']}>
            <h2>Production Companies</h2>
            <span className={styles.companies}>{prodCompanies}</span>
          </div>
          <div className={styles['container--small']}>
            <h2>Cast</h2>
            <div className={styles['container-content']}>
              <Pagination
                gallery
                currentPage={currentPageCast}
                numberOfPages={Math.ceil(loadedCast.length / 5)}
                onClickPrev={prevHandlerCast}
                onClickNext={nextHandlerCast}
              >
                <div className={styles.team}>{cast}</div>
              </Pagination>
            </div>
          </div>
          <div className={styles['container--small']}>
            <h2>Crew</h2>
            <div className={styles['container-content']}>
              <Pagination
                gallery
                currentPage={currentPageCrew}
                numberOfPages={Math.ceil(loadedCrew.length / 5)}
                onClickPrev={prevHandlerCrew}
                onClickNext={nextHandlerCrew}
              >
                <div className={styles.team}>{crew}</div>
              </Pagination>
            </div>
          </div>
          <div className={styles['container--small']}>
            <h2>Videos</h2>
            <div className={styles['container-content']}>
              <Pagination
                gallery
                currentPage={currentPageVideo}
                numberOfPages={Math.ceil(loadedVideos.length / 5)}
                onClickPrev={prevHandlerVideo}
                onClickNext={nextHandlerVideo}
              >
                <Gallery
                  video
                  videos={getPaginatedData(currentPageVideo, loadedVideos)}
                />
              </Pagination>
            </div>
          </div>
          <div className={styles['container--small']}>
            <h2>Photos</h2>
            <div className={styles['container-content']}>
              <Pagination
                gallery
                currentPage={currentPageImage}
                numberOfPages={Math.ceil(loadedImages.length / 5)}
                onClickPrev={prevHandlerImage}
                onClickNext={nextHandlerImage}
              >
                <Gallery
                  image
                  images={getPaginatedData(currentPageImage, loadedImages)}
                />
              </Pagination>
            </div>
          </div>
          <div className={styles['container--small']}>
            <h2>More like this</h2>
            <div className={styles['container-content']}>
              <Pagination
                gallery
                currentPage={currentPageSimilar}
                numberOfPages={Math.ceil(loadedSimilar.length / 5)}
                onClickNext={nextHandlerSimilar}
                onClickPrev={prevHandlerSimilar}
              >
                <div className={styles.similar}>{similarMovies}</div>
              </Pagination>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default MovieDetails;
