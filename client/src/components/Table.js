import styles from './Table.module.css';
import TableItem from './TableItem';

const Table = (props) => {
  return (
    <table className={styles.table}>
      <thead className={styles.table__header}>
        <tr>
          <th>Photo</th>
          <th>Name</th>
          <th>Department</th>
          <th>Job</th>
        </tr>
      </thead>
      <tbody className={styles.table__body}>
        {props.data.map((person, index) => {
          return (
            <TableItem
              key={index}
              profile_path={person.profile_path}
              name={person.name}
              department={person.known_for_department}
              gender={person.gender}
              job={person.job}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
