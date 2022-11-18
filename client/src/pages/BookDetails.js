import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

import { useHttpClient } from '../hooks/http-hook';

import styles from './BookDetails.module.css';

const BookDetails = () => {
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
    loadedBook.volumeInfo.authors.map((author, index) => {
      return <p key={index}>{author}</p>;
    });

  let publishers;

  if (loadedBook.volumeInfo) {
    if (loadedBook.volumeInfo.publishers) {
      publishers = loadedBook.volumeInfo.publishers.map((publisher, index) => (
        <p key={index}>{publisher}</p>
      ));
    }

    publishers = loadedBook.volumeInfo.publisher;
  }

  const genres =
    loadedBook.volumeInfo &&
    loadedBook.volumeInfo.categories.map((category, index) => (
      <span key={index}>{category}</span>
    ));

  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      {!isLoading && loadedBook.volumeInfo && (
        <section>
          <div>
            <img
              src={
                loadedBook.volumeInfo &&
                loadedBook.volumeInfo.imageLinks.thumbnail
              }
              alt="Book cape"
            />
          </div>
          <h1>{loadedBook.volumeInfo.title}</h1>
          <h2>Description</h2>
          <p
            dangerouslySetInnerHTML={{
              __html: loadedBook.volumeInfo.description,
            }}
          ></p>
          <h2>Authors</h2>
          {authors}
          <h2>Publishers</h2>
          {publishers}
          <h2>Publish Date</h2>
          <p>{loadedBook.volumeInfo.publishedDate}</p>
          <h2>Rating</h2>
          <span>{loadedBook.volumeInfo.averageRating}</span>
          <h2>Genres</h2>
          {genres}
        </section>
      )}
    </Fragment>
  );
};

export default BookDetails;
