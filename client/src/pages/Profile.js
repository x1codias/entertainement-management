import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ProfileLists from '../components/ProfileLists';

import styles from './Profile.module.css';

const Profile = () => {
  const [entertainementType, setEntertainementType] = useState('movie');
  const [myMovies, setMyMovies] = useState([]);
  const [myShows, setMyShows] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [myGames, setMyGames] = useState([]);
  const { uname } = useParams();

  const entertainmentHandler = (e) => {
    e.preventDefault();
    setEntertainementType(e.target.value);
  };

  useEffect(() => {}, []);

  return (
    <div className={styles.profile}>
      <section className={styles.user}>
        <div className={styles['user--background-img']}>
          <img src="" alt="" />
        </div>
        <div className={styles['user--img']}>
          <img src="" alt="" />
        </div>
        <h2 className={styles['user--name']}>{uname}</h2>
      </section>
      <section className={styles.lists}>
        <div onClick={entertainmentHandler}>
          <ul className={styles['list--items']}>
            <li className={styles['list--item']}>
              <label htmlFor="movie">Movies</label>
              <input
                type="radio"
                id="movie"
                name="movie"
                value="movie"
                className={styles['list--item-btn']}
              />
            </li>
            <li className={styles['list--item']}>
              <label htmlFor="show">Shows</label>
              <input
                type="radio"
                id="show"
                name="show"
                value="show"
                className={styles['list--item-btn']}
              />
            </li>
            <li className={styles['list--item']}>
              <label htmlFor="book">Books</label>
              <input
                type="radio"
                id="book"
                name="book"
                value="book"
                className={styles['list--item-btn']}
              />
            </li>
            <li className={styles['list--item']}>
              <label htmlFor="game">Games</label>
              <input
                type="radio"
                id="game"
                name="game"
                value="game"
                className={styles['list--item-btn']}
              />
            </li>
          </ul>
        </div>
        {entertainementType === 'movie' && (
          <ProfileLists done="Watched" toDo="To Watch" />
        )}
        {entertainementType === 'show' && (
          <ProfileLists
            done="Watched"
            doing="Currently Watching"
            toDo="To Watch"
          />
        )}
        {entertainementType === 'book' && (
          <ProfileLists done="Read" toDo="To Read" />
        )}
        {entertainementType === 'game' && (
          <ProfileLists
            done="Played"
            doing="Currently Playing"
            toDo="To Play"
          />
        )}
      </section>
    </div>
  );
};

export default Profile;
