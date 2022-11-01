import WelcomeItem from "../components/WelcomeItem";

import { RiMovie2Fill } from "react-icons/ri";
import { BiMoviePlay } from "react-icons/bi";
import { AiOutlineTaobao } from "react-icons/ai";
import { GiOpenBook } from "react-icons/gi";
import { IoLogoGameControllerB } from "react-icons/io";

import styles from "./Welcome.module.css";

const Welcome = () => {
  return (
    <section className={styles.container}>
      <h1 className={`${styles.centered} ${styles.welcome}`}>
        Welcome to the ChillPlanner
      </h1>
      <h2 className={`${styles.centered} ${styles.manage}`}>
        Manage all your favorite
      </h2>
      <div className={`${styles.grid} ${styles["grid--5-cols"]}`}>
        <WelcomeItem entertainmentType="Movies">
          <RiMovie2Fill />
        </WelcomeItem>
        <WelcomeItem entertainmentType="Shows">
          <BiMoviePlay />
        </WelcomeItem>
        <WelcomeItem entertainmentType="Animes">
          <AiOutlineTaobao />
        </WelcomeItem>
        <WelcomeItem entertainmentType="Books">
          <GiOpenBook />
        </WelcomeItem>
        <WelcomeItem entertainmentType="Games">
          <IoLogoGameControllerB />
        </WelcomeItem>
      </div>
      <h2 className={`${styles.centered} ${styles.manage}`}>In one place </h2>
    </section>
  );
};

export default Welcome;
