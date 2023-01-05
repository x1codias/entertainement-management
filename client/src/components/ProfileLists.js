import ProfileList from './ProfileList';

import styles from './ProfileLists.module.css';

const ProfileLists = (props) => {
  return (
    <div className={styles.container}>
      <ProfileList title={props.done} content={props.content} />
      {(props.entertainementType === 'show' ||
        props.entertainementType === 'game') && (
        <ProfileList title={props.doing} content={props.content} />
      )}
      <ProfileList title={props.toDo} content={props.content} />
      <ProfileList title="Favorite" content={props.content} />
    </div>
  );
};

export default ProfileLists;
