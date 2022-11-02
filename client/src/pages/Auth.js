import { useState } from "react";
import { Transition } from "react-transition-group";

import Button from "../components/Button";

import styles from "./Auth.module.css";

// TODO: retoques no css (adicionar icons nos inputs e efeitos neon no resto, tratar das animações)

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const signupForm = (
    <Transition in={isLoginMode} timeout={300}>
      <div className={styles["auth--form"]}>
        <p className={styles["auth--form__title"]}>SIGN UP</p>
        <form className={styles["auth--form__login"]}>
          <div className={styles["auth--form__group"]}>
            <input
              className={styles["auth--form__input"]}
              placeholder="Email"
              type="text"
              name="email"
              id="email"
            />
            <label for="email" className={styles["auth--form__label"]}>
              Email
            </label>
          </div>
          <div className={styles["auth--form__group"]}>
            <input
              className={styles["auth--form__input"]}
              placeholder="Username"
              type="text"
              name="username"
              id="username"
            />
            <label for="username" className={styles["auth--form__label"]}>
              Username
            </label>
          </div>
          <div className={styles["auth--form__group"]}>
            <input
              className={styles["auth--form__input"]}
              placeholder="Password"
              type="password"
              name="password"
              id="password"
            />
            <label for="password" className={styles["auth--form__label"]}>
              Password
            </label>
          </div>
          <div className={styles["auth--form__btn-group"]}>
            <Button login>SIGN UP</Button>
          </div>
        </form>
      </div>
    </Transition>
  );

  const loginForm = (
    <Transition in={isLoginMode} timeout={300}>
      <div className={styles["auth--form"]}>
        <p className={styles["auth--form__title"]}>LOG IN</p>
        <form className={styles["auth--form__login"]}>
          <div className={styles["auth--form__group"]}>
            <input
              className={styles["auth--form__input"]}
              placeholder="Email"
              type="text"
              name="email"
              id="email"
            />
            <label for="email" className={styles["auth--form__label"]}>
              Email
            </label>
          </div>
          <div className={styles["auth--form__group"]}>
            <input
              className={styles["auth--form__input"]}
              placeholder="Password"
              type="password"
              name="password"
              id="password"
            />
            <label for="password" className={styles["auth--form__label"]}>
              Password
            </label>
          </div>
          <div className={styles["auth--form__btn-group"]}>
            <Button>Forgot Password?</Button>
            <Button login>LOG IN</Button>
          </div>
        </form>
      </div>
    </Transition>
  );

  return (
    <section className={styles.container}>
      <div className={styles.auth}>
        {isLoginMode && (
          <div className={styles["auth--have-account"]}>
            <h1 className={styles["auth--have-account__title"]}>
              Don't Have an account?
            </h1>
            <p className={styles["auth--have-account__text"]}>
              Create one to start managing like never before
            </p>
            <Button onClick={switchModeHandler} className={styles.animate}>
              SIGN UP
            </Button>
          </div>
        )}
        {isLoginMode && loginForm}
        {!isLoginMode && signupForm}
        {!isLoginMode && (
          <div className={styles["auth--have-account"]}>
            <h1 className={styles["auth--have-account__title"]}>
              Have an account?
            </h1>
            <p className={styles["auth--have-account__text"]}>
              Log in to your account
            </p>
            <Button onClick={switchModeHandler} className={styles.animate}>
              LOG IN
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Auth;
