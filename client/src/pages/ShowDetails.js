import { Fragment, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { SiAppletv, SiRakuten, SiHbo, SiPrime } from 'react-icons/si';
import {
  FaGooglePlay,
  FaYoutube,
  FaRegEye,
  FaRegEyeSlash,
} from 'react-icons/fa';
import { RiNetflixFill } from 'react-icons/ri';
import { BsBookmarkPlus, BsBookmarkDash } from 'react-icons/bs';
import { TbHeart, TbHeartOff } from 'react-icons/tb';

import Gallery from '../components/Gallery';
import Pagination from '../components/Pagination';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import Table from '../components/Table';
import { useHttpClient } from '../hooks/http-hook';
import { usePagination } from '../hooks/pagination-hook';

import styles from './ShowDetails.module.css';
import avatar from '../assets/istockphoto-1337144146-170667a.jpg';

const ShowDetails = () => {
  const { id } = useParams();
  const [loadedShow, setLoadedShow] = useState({});
  const [loadedCast, setLoadedCast] = useState([]);
  const [loadedCrew, setLoadedCrew] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const [loadedVideos, setLoadedVideos] = useState([]);
  const [loadedSimilar, setLoadedSimilar] = useState([]);
  const [loadedWatchProviders, setLoadedWatchProviders] = useState([]);
  const [loadedKeywords, setLoadedKeywords] = useState([]);
  const [season, setSeason] = useState(1);
  const [selected, setSelected] = useState(1);
  const [loadedSeason, setLoadedSeason] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
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
  const {
    currentPage: currentPageImage,
    prevHandler: prevHandlerImage,
    nextHandler: nextHandlerImage,
  } = usePagination('gallery');
  const {
    currentPage: currentPageVideo,
    prevHandler: prevHandlerVideo,
    nextHandler: nextHandlerVideo,
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

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const urlShowDetails = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlCastCrew = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlWatchProviders = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/watch/providers?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlImages = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/images?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlVideos = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlSimilar = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/similar?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlEpisodes = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/season/${season}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;
        const urlKeywords = `${process.env.REACT_APP_TMDB_BASE_URL}3/tv/${id}/keywords?api_key=${process.env.REACT_APP_TMDB_API_KEY}`;

        const showData = await sendRequest(urlShowDetails);
        const castCrewData = await sendRequest(urlCastCrew);
        const streamData = await sendRequest(urlWatchProviders);
        const imageData = await sendRequest(urlImages);
        const videoData = await sendRequest(urlVideos);
        const similarData = await sendRequest(urlSimilar);
        const episodeData = await sendRequest(urlEpisodes);
        const keywordsData = await sendRequest(urlKeywords);

        console.log(showData);
        console.log(castCrewData);
        console.log(streamData.results.PT.flatrate);
        console.log(imageData);
        console.log(videoData);
        console.log(similarData);
        console.log(episodeData);
        console.log(keywordsData);

        setLoadedShow(showData);
        setLoadedCast(castCrewData.cast);
        setLoadedCrew(castCrewData.crew);
        setLoadedImages(imageData.backdrops);
        setLoadedVideos(videoData.results);
        setLoadedWatchProviders(streamData.results.PT.flatrate);
        setLoadedSeason(episodeData);
        setLoadedSimilar(similarData.results);
        setLoadedKeywords(keywordsData.results);
      } catch (err) {}
    };
    fetchShow();
  }, [sendRequest, id, season]);

  const addToFavoritesHandler = (e) => {
    e.preventDefault();
    console.log('Added to the favourites');
  };

  const watchedChangeHandler = (e) => {
    console.log(`Marked as ${e.target.value}`);
  };

  const platforms =
    loadedWatchProviders &&
    loadedWatchProviders.map((platform, index) => {
      return (
        <span key={index} className={styles.platform}>
          <IconContext.Provider value={{ size: '5rem' }}>
            {platform.provider_name.includes('Disney') && (
              <span className={styles.disney}>Disney +</span>
            )}
            {platform.provider_name.includes('Youtube') && <FaYoutube />}
            {platform.provider_name.includes('Google') && <FaGooglePlay />}
            {platform.provider_name.includes('Rakuten') && <SiRakuten />}
            {platform.provider_name.includes('HBO') && <SiHbo />}
            {platform.provider_name.includes('Netflix') && <RiNetflixFill />}
            {platform.provider_name.includes('Apple') && <SiAppletv />}
            {platform.provider_name.includes('Amazon') && <SiPrime />}
          </IconContext.Provider>
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

  let genres;

  if (loadedShow.genres !== undefined) {
    genres = loadedShow.genres.map((genre) => {
      return (
        <span
          key={genre.id}
          className={`${styles.genre} ${
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
    streaming = loadedWatchProviders.map((service) => {
      return (
        <div className={styles.details__plataform}>
          <img
            src={`https://image.tmdb.org/t/p/original${service.logo_path}`}
            alt="Streaming service"
          />
        </div>
      );
    });

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

  const getPaginatedData = (currentPage, data) => {
    const startIndex = currentPage * 5 - 5;
    const endIndex = startIndex + 5;
    return data.slice(startIndex, endIndex);
  };

  const cast =
    getPaginatedData(currentPageCast, loadedCast) &&
    getPaginatedData(currentPageCast, loadedCast).map((person, index) => {
      return (
        <Card
          key={index}
          creator
          jobCharacter={person.character}
          background={`https://image.tmdb.org/t/p/original${loadedShow.poster_path}`}
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
          background={`https://image.tmdb.org/t/p/original${loadedShow.backdrop_path}`}
          photo={
            person.profile_path !== null
              ? `https://image.tmdb.org/t/p/original${person.profile_path}`
              : avatar
          }
          name={person.original_name}
        />
      );
    });

  const similarShows = getPaginatedData(currentPageSimilar, loadedSimilar).map(
    (show) => {
      return (
        <Card
          key={show.id}
          page="/shows"
          id={show.id}
          poster={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
          title={show.title}
          description={show.overview}
          isLoading={isLoading}
        />
      );
    }
  );

  let options;

  if (loadedShow.seasons !== undefined) {
    options = loadedShow.seasons
      .filter((season) => !season.name.includes('Special'))
      .map((season, index) => {
        return (
          <option key={index} value={season.season_number}>
            {season.name}
          </option>
        );
      });
  }

  const onChangeSeasonHandler = (e) => {
    e.preventDefault();
    setSeason(e.target.value);
    setSelected(e.target.value);
  };

  let episodes;
  const episodeScores = [];

  loadedSeason &&
    loadedSeason.episodes &&
    loadedSeason.episodes.forEach((episode) =>
      episodeScores.push(episode.vote_average)
    );

  if (loadedSeason !== undefined) {
    episodes =
      loadedSeason.episodes &&
      getPaginatedData(currentPageEpisode, loadedSeason.episodes).map(
        (episode) => {
          const runtimeHours = Math.floor(episode.runtime / 60);
          const runtimeMinutes = episode.runtime % 60;
          return (
            <Card
              episode
              image={
                episode.still_path
                  ? `https://image.tmdb.org/t/p/original${episode.still_path}`
                  : `https://image.tmdb.org/t/p/original${loadedSeason.poster_path}`
              }
              title={episode.name}
              description={episode.overview}
              scoreStyle={ratingScore(Math.ceil(episode.vote_average * 10))}
              score={Math.ceil(episode.vote_average * 10)}
              runtimeHours={runtimeHours}
              runtimeMinutes={runtimeMinutes}
              airdate={episode.air_date}
            />
          );
        }
      );
  }

  const seasonScore = () => {
    const sum = episodeScores.reduce((prev, curr) => prev + curr, 0);
    const average = Math.ceil(
      (loadedSeason.episodes && sum / loadedSeason.episodes.length) * 10
    );
    return average;
  };

  const prodCompanies =
    loadedShow &&
    loadedShow.production_companies &&
    loadedShow.production_companies.map((proComp, index) => {
      return (
        <span key={index} className={styles.company}>
          {proComp.name}
        </span>
      );
    });

  const networks =
    loadedShow &&
    loadedShow.networks &&
    loadedShow.networks.map((network, index) => {
      return (
        <span key={index} className={styles.network}>
          {network.name}
        </span>
      );
    });

  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      <section className={styles.details}>
        <div className={styles.background}>
          <img
            src={`https://image.tmdb.org/t/p/original${loadedShow.backdrop_path}`}
            alt="Show background"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.platforms}>{platforms}</div>
            <h1 className={styles.details__title}>{loadedShow.name}</h1>
            <h2 className={styles.subtitle}>{loadedShow.tagline}</h2>
            <div className={styles.title__content}>
              <span className={styles.released}>{loadedShow.status}</span>
              <p>
                <span className={styles.runtime}>
                  {loadedShow.number_of_seasons}
                </span>
                &nbsp; seasons
              </p>
              <p>
                <span className={styles.runtime}>
                  {loadedShow.number_of_episodes}
                </span>
                &nbsp; episodes
              </p>
              <div className={styles['title__btn--group']}>
                <div
                  className={styles['title__btn']}
                  title="Add movie to watched list"
                >
                  <label htmlFor="eye" className={styles['title__btn--label']}>
                    <input
                      id="eye"
                      name="eye"
                      type="checkbox"
                      onChange={watchedChangeHandler}
                      value="watched"
                    />
                    <IconContext.Provider
                      value={{
                        size: '2.5rem',
                        className: `${styles['title__btn--icon']}`,
                      }}
                    >
                      <FaRegEye />
                    </IconContext.Provider>
                  </label>
                </div>
                <button
                  onClick={addToFavoritesHandler}
                  className={styles['title__btn']}
                  title="Add movie to favorites list"
                >
                  <IconContext.Provider
                    value={{
                      size: '2.5rem',
                      className: `${styles['title__btn--icon']}`,
                    }}
                  >
                    <TbHeart />
                  </IconContext.Provider>
                </button>
                <div
                  className={styles['title__btn']}
                  title="Add movie to watch list"
                >
                  <label
                    htmlFor="bookmark"
                    className={styles['title__btn--label']}
                  >
                    <input
                      id="bookmark"
                      name="bookmark"
                      type="checkbox"
                      onChange={watchedChangeHandler}
                      value="toWatch"
                    />
                    <IconContext.Provider
                      value={{
                        size: '2.5rem',
                        className: `${styles['title__btn--icon']}`,
                      }}
                    >
                      <BsBookmarkPlus />
                    </IconContext.Provider>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.tags}>{tags}</div>
          <h2>Overview</h2>
          <p className={styles.details__description}>{loadedShow.overview}</p>
          <div className={styles.container}>
            <div className={styles['container--small']}>
              <h2>Genres</h2>
              <div className={styles.genres}>{genres}</div>
            </div>
            <div className={styles['container--small']}>
              <h2>Rating</h2>
              <span
                className={`${styles.rating} ${styles[ratingScore(rating)]}`}
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
                )}
                {streaming} {buy}
              </div>
            </div>
            <div className={styles['container--small']}>
              <h2>Release Date</h2>
              <span className={styles.released}>
                {loadedShow.first_air_date}
              </span>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles['container--small']}>
              <h2>Production Companies</h2>
              <span className={styles.companies}>{prodCompanies}</span>
            </div>
            <div className={styles['container--small']}>
              <h2>Networks</h2>
              <span className={styles.networks}>{networks}</span>
            </div>
          </div>
          <div className={styles['container--small']}>
            <h2>Seasons and Episodes</h2>
            <select onChange={onChangeSeasonHandler}>{options}</select>
            {loadedShow.seasons && (
              <div
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${loadedSeason.poster_path})`,
                }}
                className={styles.episode__content}
              >
                <div className={styles.title__season__container}>
                  <h1 className={styles.details__title}>{loadedSeason.name}</h1>
                  <span
                    className={`${styles['details__rating--filled']} ${
                      styles[`${ratingScore(seasonScore())}--filled`]
                    }`}
                  >
                    {seasonScore()}
                  </span>
                </div>
                {loadedSeason.overview && (
                  <Fragment>
                    <h2>Overview</h2>
                    <p className={styles.details__description}>
                      {loadedSeason.overview}
                    </p>
                  </Fragment>
                )}
                <div className={styles['container-content']}>
                  <Pagination
                    gallery
                    currentPage={currentPageEpisode}
                    numberOfPages={
                      loadedSeason.episodes &&
                      Math.ceil(loadedSeason.episodes.length / 5)
                    }
                    onClickPrev={prevHandlerEpisode}
                    onClickNext={nextHandlerEpisode}
                  >
                    <div className={styles.episodes}>{episodes}</div>
                  </Pagination>
                </div>
              </div>
            )}
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
                <div className={styles.similar}>{similarShows}</div>
              </Pagination>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default ShowDetails;
