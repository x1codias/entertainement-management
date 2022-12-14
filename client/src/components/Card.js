import { Fragment } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineArrowRight } from 'react-icons/ai';

import LoadingSpinner from './LoadingSpinner';
import Button from './Button';

import styles from './Card.module.css';

const Card = (props) => {
  if (props.creator) {
    const positions =
      props.positions &&
      props.positions.map((position, index) => (
        <span
          key={index}
          className={`${styles.position} ${styles[`${position.slug}`]}`}
        >
          {position.name}
        </span>
      ));

    const knownGames =
      props.knownGames &&
      props.knownGames.map((game, index) => (
        <li key={index} className={styles['known-for']}>
          {game.name}
        </li>
      ));

    return (
      <Fragment>
        <div className={styles.creator}>
          {props.isLoading && <LoadingSpinner />}
          {!props.isLoading && (
            <Fragment>
              <div className={styles['background-container']}>
                <img src={props.background} alt="Background most known game" />
              </div>
              <div className={styles['photo-container']}>
                <img src={props.photo} alt="Team member" />
              </div>
              <div className={styles.content}>
                <h2 className={styles.name}>{props.name}</h2>
                <div className={styles.positions}>
                  {props.positions && positions}{' '}
                  {props.jobCharacter && (
                    <span className={styles.position}>
                      {props.jobCharacter}
                    </span>
                  )}
                </div>
                <div className={styles['known-for--container']}>
                  <h2>Known For</h2>
                  <ul className={styles['known-for--list']}>{knownGames}</ul>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  }

  if (props.achievment) {
    return (
      <Fragment>
        <div className={styles.achievment}>
          {props.isLoading && <LoadingSpinner />}
          {!props.isLoading && (
            <Fragment>
              <div className={styles.achievment__img}>
                <img src={props.image} alt="Achievment logo" />
              </div>
              <div className={styles.achievment__content}>
                <h2 className={styles.achievment__title}>{props.title}</h2>
                <p className={styles.achievment__description}>
                  {props.description}
                </p>
                <span className={styles.achievment__percentage}>
                  {props.percentage}%
                </span>
              </div>
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  }

  if (props.episode) {
    return (
      <Fragment>
        <div className={styles.episode}>
          {props.isLoading && <LoadingSpinner />}
          {!props.isLoading && (
            <Fragment>
              <div className={styles.episode__img}>
                <img src={props.image} alt="Backdrop of episode" />
              </div>
              <div className={styles.episode__content}>
                <div className={styles.title__container}>
                  <h2 className={styles.episode__title}>{props.title}</h2>
                  {new Date(props.airdate) < new Date() && (
                    <span
                      className={`${styles.details__rating} ${
                        styles[`${props.scoreStyle}`]
                      }`}
                    >
                      {props.score}
                    </span>
                  )}
                </div>
                <p className={styles.episode__description}>
                  {props.description}
                </p>

                <p>
                  Release Date:{' '}
                  <span className={styles.released}>{props.airdate}</span>
                </p>
                {new Date(props.airdate) < new Date() && (
                  <p>
                    <span className={styles.runtime}>
                      {props.runtimeHours !== 0 && (
                        <strong>{props.runtimeHours}h</strong>
                      )}
                      {props.runtimeMinutes !== 0 && (
                        <strong>{props.runtimeMinutes}m</strong>
                      )}
                    </span>
                    &nbsp; of runtime
                  </p>
                )}
              </div>
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className={styles.card}>
        {props.isLoading && <LoadingSpinner />}
        {!props.isLoading && (
          <Fragment>
            <div className={styles['card__image-container']}>
              <img src={props.poster} alt="Poster" />
            </div>
            <div
              className={`${styles.card__content} ${
                props.game && styles['card__game--content']
              }`}
            >
              <div className={styles.container}>
                <h1 className={styles.card__title}>{props.title}</h1>
                <span className={styles.card__review}>{props.reviewScore}</span>
              </div>
              {!props.game && (
                <div className={styles.card__description}>
                  <p>{props.description}</p>
                  {props.anime && (
                    <div
                      dangerouslySetInnerHTML={{ __html: props.description }}
                    />
                  )}
                </div>
              )}
              <Button to={`${props.page}/${props.id}`} card>
                Learn more
                <IconContext.Provider value={{ size: '2.4rem' }}>
                  <AiOutlineArrowRight />
                </IconContext.Provider>
              </Button>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Card;
