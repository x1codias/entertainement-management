import styles from './Grid.module.css';

const Grid = (props) => {
  return (
    <section className={styles.grid}>
      <div className={styles.cards}>{props.children}</div>
    </section>
  );
};

export default Grid;
