import { useState } from 'react';
import styles from './Search.module.css';

const Search = (props) => {
  return (
    <div className={styles.container}>
      <input
        type="search"
        id="search"
        placeholder="Search..."
        className={styles.input}
        onChange={props.onChange}
        value={props.initialVaue}
      />
    </div>
  );
};

export default Search;
