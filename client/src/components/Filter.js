import { Fragment } from 'react';

import Accordion from './Accordion';
import Button from './Button';
import Search from './Search';
import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from '@hassanmojab/react-modern-calendar-datepicker';

import styles from './Filter.module.css';

const Filter = (props) => {
  const possibleStates = [
    { id: 0, state: 'Returning Series' },
    { id: 1, state: 'Planned' },
    { id: 2, state: 'In Production' },
    { id: 3, state: 'Ended' },
    { id: 4, state: 'Cancelled' },
    { id: 5, state: 'Pilot' },
  ];

  const genreClassName = (genreName) => {
    if (props.movie || props.game) {
      return genreName.toLowerCase().split(' ').join('-');
    }

    if (props.show) {
      return genreName.toLowerCase().split('&').join('-').replace(/\s/g, '');
    }
  };

  const genres =
    props.genres &&
    props.genres.map((genre, index) => {
      return (
        //value = id
        <Fragment key={index}>
          <input
            id={`${genreClassName(genre.name)}`}
            type="checkbox"
            onChange={props.onGenreChange}
            className={styles.genre_input}
            value={genre.id}
          />
          <label
            htmlFor={`${genreClassName(genre.name)}`}
            className={`${styles.genre} ${
              styles[`${genreClassName(genre.name)}`]
            }`}
          >
            {genre.name}
          </label>
        </Fragment>
      );
    });

  const certifications =
    props.certifications &&
    props.certifications.map((certification, index) => {
      return (
        //value = id

        <div key={index} className={styles.container}>
          <label className={styles.toggleButton}>
            <input
              type="checkbox"
              onChange={props.onCertificationChange}
              value={certification.certification}
            />
            <div>
              <svg viewBox="0 0 44 44">
                <path
                  d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758"
                  transform="translate(-2.000000, -2.000000)"
                ></path>
              </svg>
            </div>
          </label>
          <span className={styles.certification}>
            {certification.certification}
          </span>
        </div>
      );
    });

  const streams =
    props.streams &&
    props.streams.map((stream, index) => {
      return (
        //value = id
        <Fragment>
          <input
            id={`${stream.provider_name.toLowerCase().split(' ').join('-')}`}
            type="checkbox"
            key={index}
            onChange={props.onStreamChange}
            className={styles.genre_input}
            value={stream.provider_id}
          />
          <label
            htmlFor={`${stream.provider_name
              .toLowerCase()
              .split(' ')
              .join('-')}`}
            className={styles.genre}
          >
            {stream.provider_name}
          </label>
        </Fragment>
      );
    });

  const states = possibleStates.map((state, index) => {
    //value = id

    return (
      <div key={index} className={styles.container}>
        <label className={styles.toggleButton}>
          <input
            type="checkbox"
            onChange={props.onStateChange}
            value={state.id}
          />
          <div>
            <svg viewBox="0 0 44 44">
              <path
                d="M14,24 L21,31 L39.7428882,11.5937758 C35.2809627,6.53125861 30.0333333,4 24,4 C12.95,4 4,12.95 4,24 C4,35.05 12.95,44 24,44 C35.05,44 44,35.05 44,24 C44,19.3 42.5809627,15.1645919 39.7428882,11.5937758"
                transform="translate(-2.000000, -2.000000)"
              ></path>
            </svg>
          </div>
        </label>
        <span className={styles.certification}>{state.state}</span>
      </div>
    );
  });

  const platforms =
    props.platforms &&
    props.platforms.map((platform, index) => {
      return (
        <Fragment>
          <input
            id={platform.name}
            type="checkbox"
            key={index}
            onChange={props.onPlatformChange}
            className={styles.genre_input}
            value={platform.id}
          />
          <label htmlFor={platform.name} className={styles.genre}>
            {platform.name}
          </label>
        </Fragment>
      );
    });

  const stores =
    props.stores &&
    props.stores.map((store, index) => {
      return (
        <Fragment>
          <input
            id={store.name}
            type="checkbox"
            key={index}
            onChange={props.onStoreChange}
            className={styles.genre_input}
            value={store.id}
          />
          <label htmlFor={store.name} className={styles.genre}>
            {store.name}
          </label>
        </Fragment>
      );
    });

  const calendar = (
    <Calendar
      value={props.calendarRange}
      onChange={props.onChangeCalendarRange}
      colorPrimary="#4386a6"
      colorPrimaryLight="rgba(67, 134, 166, 0.4)"
      shouldHighlightWeekends
    />
  );

  const accordionMovies = [
    {
      title: 'Genres',
      content: <div className={styles.genres}>{genres}</div>,
    },
    {
      title: 'Certification',
      content: <div className={styles.certifications}>{certifications}</div>,
    },
    {
      title: 'Release Date Range',
      content: calendar,
    },
    {
      title: 'Streaming Platform',
      content: <div className={styles.genres}>{streams}</div>,
    },
  ];

  const accordionShows = [
    {
      title: 'Genres',
      content: <div className={styles.genres}>{genres}</div>,
    },
    {
      title: 'Certification',
      content: <div className={styles.certifications}>{certifications}</div>,
    },
    {
      title: 'State',
      content: <div className={styles.states}>{states}</div>,
    },
    {
      title: 'Release Date Range',
      content: calendar,
    },
    {
      title: 'Streaming Platform',
      content: <div className={styles.genres}>{streams}</div>,
    },
  ];

  const accordionBooks = [
    {
      title: 'Categories',
      content: (
        <Search
          onChange={props.onChangeCategory}
          initialValue={props.inputCategory}
        />
      ),
    },
    {
      title: 'Author',
      content: (
        <Search
          onChange={props.onChangeAuthor}
          initialValue={props.inputAuthor}
        />
      ),
    },
  ];

  const accordionGames = [
    {
      title: 'Genres',
      content: <div className={styles.genres}>{genres}</div>,
    },
    {
      title: 'Platforms',
      content: <div className={styles.genres}>{platforms}</div>,
    },
    {
      title: 'Stores',
      content: <div className={styles.genres}>{stores}</div>,
    },
    {
      title: 'Release Date Range',
      content: calendar,
    },
  ];

  return (
    <Fragment>
      <form className={styles.filter} onSubmit={props.onSubmit}>
        <div className={styles.accordion}>
          {props.movie &&
            accordionMovies.map((element, index) => {
              return (
                <Accordion
                  key={index}
                  title={element.title}
                  content={element.content}
                />
              );
            })}
          {props.show &&
            accordionShows.map((element, index) => {
              return (
                <Accordion
                  key={index}
                  title={element.title}
                  content={element.content}
                />
              );
            })}
          {props.book &&
            accordionBooks.map((element, index) => {
              return (
                <Accordion
                  key={index}
                  title={element.title}
                  content={element.content}
                />
              );
            })}
          {props.game &&
            accordionGames.map((element, index) => {
              return (
                <Accordion
                  key={index}
                  title={element.title}
                  content={element.content}
                />
              );
            })}
        </div>
        <Button>Apply Filters</Button>
      </form>
    </Fragment>
  );
};

export default Filter;
