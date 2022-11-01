import { IconContext } from "react-icons";

import styles from "./WelcomeItem.module.css";

const WelcomeItem = (props) => {
  return (
    <div className={styles.item}>
      <IconContext.Provider value={{ size: "3.2rem" }}>
        {props.children}
      </IconContext.Provider>
      <p className={styles["item-title"]}>{props.entertainmentType}</p>
    </div>
  );
};

export default WelcomeItem;
