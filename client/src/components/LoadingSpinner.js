import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return (
    <div className={styles.loader}>
      <svg
        className={styles['loader__svg']}
        viewBox="0 0 120 120"
        version="1.1"
      >
        <circle
          className={`${styles.load} ${styles.one}`}
          cx="60"
          cy="60"
          r="40"
        />
        <circle
          className={`${styles.load} ${styles.two}`}
          cx="60"
          cy="60"
          r="40"
        />
        <circle
          className={`${styles.load} ${styles.three}`}
          cx="60"
          cy="60"
          r="40"
        />
        <g>
          <circle
            className={`${styles.point} ${styles.one}`}
            cx="45"
            cy="70"
            r="5"
          />
          <circle
            className={`${styles.point} ${styles.two}`}
            cx="60"
            cy="70"
            r="5"
          />
          <circle
            className={`${styles.point} ${styles.three}`}
            cx="75"
            cy="70"
            r="5"
          />
        </g>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
