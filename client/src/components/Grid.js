import styles from './Grid.module.css';

const Grid = (props) => {
  return <section className={styles.grid}>{props.children}</section>;
};

export default Grid;
