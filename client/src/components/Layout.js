import { Fragment } from "react";

import styles from "./Layout.module.css";

const Layout = (props) => {
  return (
    <Fragment>
      <main className={styles.main}>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
