import { Fragment } from 'react';
import styles from './Card.module.css';
import LoadingSpinner from './LoadingSpinner';

const Card = (props) => {
  return (
    <Fragment>
      <div className={styles['card']}>
        {props.isLoading && <LoadingSpinner />}
        {!props.isLoading && (
          <Fragment>
            <div className={styles['card__image-container']}>
              <img src={props.poster} alt="Poster" />
            </div>
            <div className={styles['cad__content']}>
              <h1 className={styles['card__title']}>{props.title}</h1>
              <p>{props.description}</p>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Card;
