import styles from './Gallery.module.css';

const Gallery = (props) => {
  return (
    <div className={styles.gallery__container}>
      {props.image &&
        props.images &&
        props.images.map((image, index) => {
          return (
            <div key={index} className={styles.gallery__card}>
              <img
                src={
                  image.file_path
                    ? `https://image.tmdb.org/t/p/original${image.file_path}`
                    : image.image
                }
                alt="Diffent movie backdrops"
              />
            </div>
          );
        })}
      {props.video &&
        props.videos &&
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
              />
            </div>
          );
        })}
    </div>
  );
};

export default Gallery;
