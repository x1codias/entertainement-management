import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

import LoadingSpinner from '../components/LoadingSpinner';
import { useHttpClient } from '../hooks/http-hook';

import styles from './BookDetails.module.css';

const BookDetails = () => {
  const stars = Array(5).fill(0);
  const { id } = useParams();
  const [loadedBook, setLoadedBook] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchBook = async () => {
      const url = `${process.env.REACT_APP_GOOGLE_BOOKS_BASE_URL}/${id}`;
      try {
        const responseData = await sendRequest(url);

        console.log(responseData);

        setLoadedBook(responseData);
      } catch (err) {}
    };
    fetchBook();
  }, [sendRequest, id]);

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
