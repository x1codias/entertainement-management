import { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { IconContext } from 'react-icons';
import {
  FaSteam,
  FaPlaystation,
  FaXbox,
  FaGooglePlay,
  FaItchIo,
  FaApple,
  FaLinux,
  FaAndroid,
  FaDesktop,
  FaNeos,
  FaGlobe,
} from 'react-icons/fa';
import { GrAppleAppStore } from 'react-icons/gr';
import {
  SiGogdotcom,
  SiNintendo,
  SiEpicgames,
  SiAtari,
  SiSega,
  SiWeb3Dotjs,
} from 'react-icons/si';
import { AiFillWindows } from 'react-icons/ai';

import LoadingSpinner from '../components/LoadingSpinner';
import Card from '../components/Card';
import Gallery from '../components/Gallery';
import { useHttpClient } from '../hooks/http-hook';

import styles from './GameDetails.module.css';

const GameDetails = () => {
  const { id } = useParams();
  const [loadedGame, setLoadedGame] = useState({});
  const [loadedAchievments, setLoadedAchievments] = useState([]);
  const [loadedVideos, setLoadedVideos] = useState([]);
  const [loadedImages, setLoadedImages] = useState([]);
  const [loadedAdditions, setLoadedAdditions] = useState([]);
  const [loadedInstallments, setLoadedInstallments] = useState([]);
  const [loadedTeam, setLoadedTeam] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchGame = async () => {
      const urlGame = `${process.env.REACT_APP_RAWG_BASE_URL}/${id}?key=${process.env.REACT_APP_RAWG_API_KEY}`;
      const urlAchievments = `${process.env.REACT_APP_RAWG_BASE_URL}/${id}/achievements?key=${process.env.REACT_APP_RAWG_API_KEY}`;
      const urlVideos = `${process.env.REACT_APP_RAWG_BASE_URL}/${id}/movies?page_size=5&key=${process.env.REACT_APP_RAWG_API_KEY}`;
      const urlImages = `${process.env.REACT_APP_RAWG_BASE_URL}/${id}/screenshots?page_size=5&key=${process.env.REACT_APP_RAWG_API_KEY}`;
      const urlAdditions = `${process.env.REACT_APP_RAWG_BASE_URL}/${id}/additions?page_size=5&key=${process.env.REACT_APP_RAWG_API_KEY}`;
      const urlInstallments = `${process.env.REACT_APP_RAWG_BASE_URL}/${id}/game-series?page_size=5&key=${process.env.REACT_APP_RAWG_API_KEY}`;
      const urlTeam = `${process.env.REACT_APP_RAWG_BASE_URL}/${id}/development-team?page_size=5&key=${process.env.REACT_APP_RAWG_API_KEY}`;

      try {
        const gameData = await sendRequest(urlGame);
        const achievmentsData = await sendRequest(urlAchievments);
        const videosData = await sendRequest(urlVideos);
        const imagesData = await sendRequest(urlImages);
        const additionsData = await sendRequest(urlAdditions);
        const installmentsData = await sendRequest(urlInstallments);
        const teamData = await sendRequest(urlTeam);

        console.log(gameData);
        console.log(achievmentsData);
        console.log(videosData);
        console.log(imagesData);
        console.log(additionsData);
        console.log(installmentsData);
        console.log(teamData);

        setLoadedGame(gameData);
        setLoadedAchievments(achievmentsData);
        setLoadedVideos(videosData);
        setLoadedImages(imagesData);
        setLoadedAdditions(additionsData);
        setLoadedInstallments(installmentsData);
        setLoadedTeam(teamData);
      } catch (err) {}
    };
    fetchGame();
  }, [sendRequest, id]);

  const platforms =
    loadedGame.parent_platforms &&
    loadedGame.parent_platforms.map((platform, index) => {
      return (
        <span key={index} className={styles.platform}>
          <IconContext.Provider value={{ size: '3rem' }}>
            {platform.platform.id === 1 && <AiFillWindows />}
            {platform.platform.id === 2 && <FaPlaystation />}
            {platform.platform.id === 3 && <FaXbox />}
            {platform.platform.id === 4 && <FaApple />}
            {platform.platform.id === 5 && <FaApple />}
            {platform.platform.id === 6 && <FaLinux />}
            {platform.platform.id === 7 && <SiNintendo />}
            {platform.platform.id === 8 && <FaAndroid />}
            {platform.platform.id === 9 && <SiAtari />}
            {platform.platform.id === 10 && <FaDesktop />}
            {platform.platform.id === 11 && <SiSega />}
            {platform.platform.id === 12 && <SiWeb3Dotjs />}
            {platform.platform.id === 13 && <FaNeos />}
            {platform.platform.id === 14 && <FaGlobe />}
          </IconContext.Provider>
        </span>
      );
    });

  const stores =
    loadedGame.stores &&
    loadedGame.stores.map((store, index) => {
      return (
        <span key={index} className={styles.store}>
          <IconContext.Provider value={{ size: '4.5rem' }}>
            {store.store.id === 1 && <FaSteam />}
            {store.store.id === 3 && <FaPlaystation />}
            {store.store.id === 2 && <FaXbox />}
            {store.store.id === 4 && <GrAppleAppStore />}
            {store.store.id === 5 && <SiGogdotcom />}
            {store.store.id === 6 && <SiNintendo />}
            {store.store.id === 7 && (
              <span className={styles.xbox360}>
                <FaXbox />
                360
              </span>
            )}
            {store.store.id === 8 && <FaGooglePlay />}
            {store.store.id === 9 && <FaItchIo />}
            {store.store.id === 11 && <SiEpicgames />}
          </IconContext.Provider>
        </span>
      );
    });

  const genres =
    loadedGame.genres &&
    loadedGame.genres.map((genre, index) => {
      return (
        <span
          key={index}
          className={`${styles.genre} ${styles[`${genre.slug}`]}`}
        >
          {genre.name}
        </span>
      );
    });

  const developers =
    loadedGame.developers &&
    loadedGame.developers.map((developer, index) => (
      <p key={index} className={styles.developer}>
        {developer.name}
      </p>
    ));

  const publishers =
    loadedGame.publishers &&
    loadedGame.publishers.map((publisher, index) => (
      <p key={index} className={styles.publisher}>
        {publisher.name}
      </p>
    ));

  const tags =
    loadedGame.tags &&
    loadedGame.tags.map((tag, index) => (
      <span key={index} className={styles.tag}>
        {tag.name}
      </span>
    ));

  const achievements =
    loadedAchievments.results &&
    loadedAchievments.results.map((achievement, index) => {
      return (
        <Card
          key={index}
          achievment
          image={achievement.image}
          title={achievement.name}
          description={achievement.description}
          percentage={achievement.percent}
        />
      );
    });

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

  const team =
    loadedTeam.results &&
    loadedTeam.results.map((person, index) => {
      return (
        <Card
          key={index}
          creator
          positions={person.positions}
          knownGames={person.games}
          background={person.image_background}
          photo={person.image}
          name={person.name}
        />
      );
    });

  const htmlDecode = (content) => {
    let e = document.createElement('div');
    e.innerHTML = content;
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
  };

  const requirements =
    loadedGame.platforms &&
    loadedGame.platforms.map((platform, index) => {
      return (
        platform.platform.slug === 'pc' && (
          <Fragment>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  htmlDecode(platform.requirements.minimum)
                ),
              }}
            />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  htmlDecode(platform.requirements.recommended)
                ),
              }}
            />
          </Fragment>
        )
      );
    });

  return (
    <Fragment>
      {isLoading && (
        <div className={styles.center}>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedGame && (
        <section className={styles.details}>
          <div className={styles.background}>
            <img
              src={loadedGame.background_image_additional}
              alt="Game background"
            />
          </div>
          <div className={styles.content}>
            <div>
              <div className={styles.platforms}>{platforms}</div>
              <h1 className={styles.title}>{loadedGame.name}</h1>
              <div className={styles.title__content}>
                <span className={styles.released}>{loadedGame.released}</span>
                <span className={styles.playtime}>
                  {loadedGame.playtime} playable hours
                </span>
              </div>
            </div>
            <div className={styles.tags}>{tags}</div>
            <div className={styles.container}>
              <h2>Description</h2>
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(loadedGame.description),
                }}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.container}>
                <h2>Stores</h2>
                <div className={styles.stores}>{stores}</div>
              </div>
              <div className={styles.container}>
                <h2>Genres</h2>
                <div className={styles.genres}>{genres}</div>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.ratings}>
                <h2>Rating</h2>
                <span
                  className={`${styles.rating} ${
                    styles[`${ratingScore(loadedGame.metacritic)}`]
                  }`}
                >
                  {loadedGame.metacritic}
                </span>
              </div>
              <div className={styles['release-date']}>
                <h2>Release Date</h2>
                <span className={styles.released}>{loadedGame.released}</span>
              </div>
            </div>
            <div className={styles.team}>
              <h2>Team</h2>
              <div className={styles.creators}>{team}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.container}>
                <h2>Developers</h2>
                {developers}
              </div>
              <div className={styles.container}>
                <h2>Publishers</h2>
                {publishers}
              </div>
            </div>
            <div className={styles.container}>
              <h2>Achievments</h2>
              <div className={styles.achievments}>{achievements}</div>
            </div>
            <div>
              <h2>Requirements</h2>
              {requirements}
            </div>
            <div>
              <h2>Images</h2>
              <Gallery image images={loadedImages.results} />
            </div>
            <div>
              <h2>Videos</h2>
              <Gallery video videos={loadedVideos.results} />
            </div>
            <div>
              <h2>DLC's and other Editions</h2>
            </div>
            <div>
              <h2>Franchise</h2>
            </div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

export default GameDetails;
