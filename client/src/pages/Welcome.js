import WelcomeItem from '../components/WelcomeItem';

import { RiMovie2Line } from 'react-icons/ri';
import { BiMoviePlay } from 'react-icons/bi';
//import { AiOutlineTaobao } from 'react-icons/ai';
import { BsController } from 'react-icons/bs';
import { GoBook } from 'react-icons/go';

import styles from './Welcome.module.css';

const Welcome = () => {
  return (
    <section className={styles['welcome--section']}>
      <div className={styles.container}>
        <h1 className={`${styles.centered} ${styles.welcome}`}>ChillPlanner</h1>
        <h2 className={`${styles.centered} ${styles.manage}`}>
          <b>Manage all your favorite</b>
        </h2>
        <div className={styles.grid}>
          <WelcomeItem entertainmentType="Movies">
            <RiMovie2Line className={styles.icon} />
          </WelcomeItem>
          <WelcomeItem entertainmentType="Shows">
            <BiMoviePlay className={styles.icon} />
          </WelcomeItem>
          {/* <WelcomeItem entertainmentType="Animes">
          <AiOutlineTaobao />
        </WelcomeItem> */}
          <WelcomeItem entertainmentType="Books">
            <GoBook className={styles.icon} />
          </WelcomeItem>
          <WelcomeItem entertainmentType="Games">
            <BsController className={styles.icon} />
          </WelcomeItem>
        </div>
        <h2 className={`${styles.centered} ${styles.manage}`}>
          <b>In one place</b>
        </h2>
      </div>
    </section>
  );
};

export default Welcome;
