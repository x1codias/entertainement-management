import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { FaStar, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { BsBookmarkPlus, BsBookmarkDash } from 'react-icons/bs';
import { TbHeart, TbHeartOff } from 'react-icons/tb';

import LoadingSpinner from '../components/LoadingSpinner';
import { useHttpClient } from '../hooks/http-hook';

import styles from './BookDetails.module.css';
import { AuthContext } from '../context/auth-context';

const BookDetails = () => {
  const auth = useContext(AuthContext);
  const stars = Array(5).fill(0);
  const { id } = useParams();
  const [loadedBook, setLoadedBook] = useState({});
  const [myFavorites, setMyFavorites] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [readingBooks, setReadingBooks] = useState([]);
  const [toReadBooks, setToReadBooks] = useState([]);
  const [backendBooks, setBackendBooks] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchBook = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const url = `${process.env.REACT_APP_GOOGLE_BOOKS_BASE_URL}/${id}`;
      const urlBackendBooks = `http://localhost:5000/api/books/`;
      const urlMyFavoriteBooks = `http://localhost:5000/api/users/${userData.username}/favorite/books`;
      const urlStatusBooks = `http://localhost:5000/api/users/${userData.username}/status/books`;

      try {
        const responseData = await sendRequest(url);
        const backendBooksData = await sendRequest(urlBackendBooks);

        if (auth.isLoggedIn) {
          const myFavoriteBooksData = await sendRequest(
            urlMyFavoriteBooks,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            }
          );
          const statusBooksData = await sendRequest(
            urlStatusBooks,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            }
          );

          console.log(myFavoriteBooksData);
          console.log(statusBooksData);
          myFavoriteBooksData && setMyFavorites(myFavoriteBooksData.favData);
          statusBooksData != null &&
            setReadBooks(statusBooksData.statusDone.entertainment);
          statusBooksData != null &&
            setToReadBooks(statusBooksData.statusToDo.entertainment);
          statusBooksData != null &&
            setReadingBooks(statusBooksData.statusDoing.entertainment);
        }

        console.log(responseData);
        console.log(backendBooksData);

        setLoadedBook(responseData);
        setBackendBooks(backendBooksData.docs);
      } catch (err) {}
    };
    fetchBook();
  }, [sendRequest, id, auth]);

  const addToFavoritesHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userData'));
      const newBook = {
        bookId: loadedBook.id,
        title: loadedBook.original_name,
        description: loadedBook.overview,
        image: loadedBook.poster_path,
      };

      const urlCreateBook = `http://localhost:5000/api/books`;
      const urlAddBookToFavorite = `http://localhost:5000/api/users/${userData.userId}/favorite/books`;

      if (
        backendBooks &&
        !backendBooks.some((book) => loadedBook.id === book.bookId)
      ) {
        await sendRequest(urlCreateBook, 'POST', JSON.stringify(newBook), {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        });
      }

      await sendRequest(
        urlAddBookToFavorite,
        'POST',
        JSON.stringify({ id: newBook.bookId }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    },
    [loadedBook, backendBooks, auth, sendRequest]
  );

  const removeFromFavoritesHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userData'));

      const urlRemoveFromFavorite = `http://localhost:5000/api/users/${userData.userId}/favorite/books/${loadedBook.id}`;

      const responseData = await sendRequest(
        urlRemoveFromFavorite,
        'PATCH',
        {},
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );

      console.log(responseData);
    },
    [loadedBook, auth, sendRequest]
  );

  const addToStatusListHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userData'));
      const newBook = {
        bookId: loadedBook.id,
        title: loadedBook.original_title,
        description: loadedBook.overview,
        image: loadedBook.poster_path,
      };

      const urlCreateBook = `http://localhost:5000/api/books`;
      const urlAddBookToWatched = `http://localhost:5000/api/users/${userData.userId}/books/status/${loadedBook.id}`;

      if (
        backendBooks &&
        !backendBooks.some((book) => loadedBook.id === book.bookId)
      ) {
        await sendRequest(urlCreateBook, 'POST', JSON.stringify(newBook), {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        });
      }
      await sendRequest(
        urlAddBookToWatched,
        'POST',
        JSON.stringify({ bookId: newBook.bookId, statusValue: e.target.value }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    },
    [auth, loadedBook, backendBooks, sendRequest]
  );

  const updateStatusListHandler = useCallback(
    async (e) => {
      e.preventDefault();
      const userData = JSON.parse(localStorage.getItem('userData'));

      const urlUpdateStatusList = `http://localhost:5000/api/users/${userData.userId}/books/status/${loadedBook.id}`;

      await sendRequest(
        urlUpdateStatusList,
        'PATCH',
        JSON.stringify({ statusValue: e.target.value }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
    },
    [loadedBook, auth, sendRequest]
  );

  const authors =
    loadedBook.volumeInfo &&
    loadedBook.volumeInfo.authors &&
    loadedBook.volumeInfo.authors.map((author, index) => {
      return (
        <span className={styles.content__span} key={index}>
          {author}
        </span>
      );
    });

  let publishers;

  if (loadedBook.volumeInfo) {
    if (loadedBook.volumeInfo.publishers) {
      publishers = loadedBook.volumeInfo.publishers.map((publisher, index) => (
        <span className={styles.content__span} key={index}>
          {publisher}
        </span>
      ));
    }

    publishers = (
      <span className={styles.content__span}>
        {loadedBook.volumeInfo.publisher}
      </span>
    );
  }

  let categoriesArray = [];

  loadedBook.volumeInfo &&
    loadedBook.volumeInfo.categories &&
    loadedBook.volumeInfo.categories.forEach((category) => {
      category.split(/[/]/).forEach((element) => {
        categoriesArray.push(element.trim());
      });
      categoriesArray = [...new Set(categoriesArray)];
    });

  const genres = categoriesArray.map((genre, index) => {
    return (
      <span className={styles.content__span} key={index}>
        {genre}
      </span>
    );
  });

  const starsRating =
    loadedBook.volumeInfo &&
    loadedBook.volumeInfo.averageRating &&
    stars.map((_, index) => {
      return (
        <FaStar
          key={index}
          size={18}
          color={
            loadedBook.volumeInfo.averageRating > index ? '#FFBA5A' : '#a9a9a9'
          }
        />
      );
    });

  const bookInFavList =
    myFavorites &&
    myFavorites.some((favBook) => favBook.bookId === loadedBook.id);

  const bookInReadList =
    readBooks &&
    readBooks.some((readBook) => readBook.bookId === loadedBook.id);

  const bookInReadingList =
    readingBooks &&
    readingBooks.some((readingBook) => readingBook.bookId === loadedBook.id);

  const bookInToReadList =
    toReadBooks &&
    toReadBooks.some((toReadBook) => toReadBook.bookId === loadedBook.id);

  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedBook.volumeInfo && (
        <section className={styles.details}>
          <div className={styles.background}>
            <img
              src={
                loadedBook.volumeInfo &&
                loadedBook.volumeInfo.imageLinks.thumbnail
              }
              alt="Book cape"
            />
          </div>
          <div className={styles.content}>
            <div>
              {loadedBook.volumeInfo.averageRating && (
                <div className={styles.stars}>{starsRating}</div>
              )}
              <h1 className={styles.title}>{loadedBook.volumeInfo.title}</h1>
              <h2 className={styles.subtitle}>
                {loadedBook.volumeInfo.subtitle}
              </h2>
              <div className={styles.title__content}>
                <span className={styles.released}>
                  {loadedBook.volumeInfo.publishedDate}
                </span>
                <p>
                  <span className={styles.pages}>
                    {loadedBook.volumeInfo.pageCount}
                  </span>{' '}
                  pages
                </p>
                <div className={styles['title__btn--group']}>
                  <label
                    htmlFor="eye"
                    className={`${styles['title__btn']} ${styles['title__btn--label']}`}
                    title="Add book to read list"
                  >
                    <input
                      id="eye"
                      name="eye"
                      type="checkbox"
                      onChange={
                        !bookInReadList
                          ? addToStatusListHandler
                          : updateStatusListHandler
                      }
                      value="done"
                    />
                    <IconContext.Provider
                      value={{
                        size: '2.5rem',
                        className: `${styles['title__btn--icon']}`,
                      }}
                    >
                      {!bookInReadList ? <FaRegEye /> : <FaRegEyeSlash />}
                    </IconContext.Provider>
                  </label>
                  <button
                    onClick={
                      !bookInFavList
                        ? addToFavoritesHandler
                        : removeFromFavoritesHandler
                    }
                    className={styles['title__btn']}
                    title="Add book to favorites list"
                  >
                    <IconContext.Provider
                      value={{
                        size: '2.5rem',
                        className: `${styles['title__btn--icon']}`,
                      }}
                    >
                      {!bookInFavList ? <TbHeart /> : <TbHeartOff />}
                    </IconContext.Provider>
                  </button>
                  <label
                    htmlFor="bookmark"
                    className={`${styles['title__btn']} ${styles['title__btn--label']}`}
                    title="Add book to wish list"
                  >
                    <input
                      id="bookmark"
                      name="bookmark"
                      type="checkbox"
                      onChange={
                        !bookInToReadList
                          ? addToStatusListHandler
                          : updateStatusListHandler
                      }
                      value="to_do"
                    />
                    <IconContext.Provider
                      value={{
                        size: '2.5rem',
                        className: `${styles['title__btn--icon']}`,
                      }}
                    >
                      {!bookInToReadList ? (
                        <BsBookmarkPlus />
                      ) : (
                        <BsBookmarkDash />
                      )}
                    </IconContext.Provider>
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.container}>
              <h2>Description</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: loadedBook.volumeInfo.description,
                }}
              ></p>
            </div>
            <div className={styles.row}>
              {authors && (
                <div className={styles.container}>
                  <h2>Authors</h2>
                  <div className={styles.authors}>{authors}</div>
                </div>
              )}
              {publishers && (
                <div className={styles.container}>
                  <h2>Publishers</h2>
                  <div className={styles.publishers}>{publishers}</div>
                </div>
              )}
            </div>
            <div className={styles.row}>
              {genres && (
                <div className={styles.container}>
                  <h2>Genres</h2>
                  <div className={styles.genres}>{genres}</div>
                </div>
              )}
              {loadedBook.volumeInfo.publishedDate && (
                <div className={styles.container}>
                  <h2>Publish Date</h2>
                  <span className={styles.content__span}>
                    {loadedBook.volumeInfo.publishedDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

export default BookDetails;
