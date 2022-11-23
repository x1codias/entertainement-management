import styles from './Gallery.module.css';
import Videos from './Videos';

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
      {props.video && <Videos videos={props.videos} />}
    </div>
  );
};

export default Gallery;
