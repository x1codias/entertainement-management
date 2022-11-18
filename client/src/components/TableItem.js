import styles from './TableItem.module.css';
import avatar from '../assets/istockphoto-1337144146-170667a.jpg';

const TableItem = (props) => {
  return (
    <tr>
      <td className={styles.cast__image}>
        <img
          src={
            props.profile_path
              ? `https://image.tmdb.org/t/p/original${props.profile_path}`
              : avatar
          }
          alt="Profiles pictures of cast"
        ></img>
      </td>
      <td className={styles.cast__name}>{props.name}</td>
      <td className={styles.cast__department}>{props.department}</td>
      <td className={styles.cast__job}>
        {!props.job && props.gender === 1 && 'Actress'}
        {!props.job && props.gender === 2 && 'Actor'}
        {!props.job && props.gender === 0 && 'Actress/Actor'}
        {props.job}
      </td>
    </tr>
  );
};

export default TableItem;
