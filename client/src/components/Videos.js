import { Fragment } from 'react';
import styles from './Videos.module.css';

const Videos = (props) => {
  return (
    <Fragment>
      {props.videos &&
        props.videos.map((video, index) => {
          return (
            <div
              key={index}
              className={`${styles.gallery__card} ${styles.video}`}
            >
              <iframe
                src={
                  video.key
                    ? `https://www.youtube.com/embed/${video.key}`
                    : video.data.max
                }
                title="Youtube video"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          );
        })}
    </Fragment>
  );
};

export default Videos;
