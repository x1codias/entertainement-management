import { useCallback, useContext, useState } from 'react';

import Button from '../components/Button';
import Input from '../components/Input';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';
import { useForm } from '../hooks/form-hook';

import styles from './Auth.module.css';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../utils/validators';

// TODO apenas falta a parte da animação em termos visuais

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    true
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }

    setIsLoginMode((prevMode) => !prevMode);
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();

    const urlSignup = `http://localhost:5000/api/users/signup`;
    const urlLogin = `http://localhost:5000/api/users/login`;

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          urlLogin,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { 'Content-Type': 'application/json' }
        );

        console.log(responseData);

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        console.log(formState);

        /*const formData = new FormData();
        formData.append('username', formState.inputs.username.value);
        formData.append('email', formState.inputs.email.value);
        formData.append('password', formState.inputs.password.value);*/

        //console.log(formData);

        const responseData = await sendRequest(
          urlSignup,
          'POST',
          JSON.stringify({
            username: formState.inputs.username.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { 'Content-Type': 'application/json' }
        );

        console.log(responseData);

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  const signupForm = (
    <div className={styles['auth--form-signup']}>
      <p className={styles['auth--form__title']}>SIGN UP</p>
      <form
        className={styles['auth--form__login']}
        onSubmit={submitFormHandler}
      >
        <Input
          id="username"
          type="text"
          label="Username"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter an username."
          onInput={inputHandler}
        />
        <Input
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password, at least 6 characters."
          onInput={inputHandler}
        />
        <div className={styles['auth--form__btn-group']}>
          <Button buttonStyle={styles.cta_button} type="submit">
            SIGN UP
          </Button>
        </div>
      </form>
    </div>
  );

  const loginForm = (
    <div className={styles['auth--form-login']}>
      <p className={styles['auth--form__title']}>LOG IN</p>
      <form
        className={styles['auth--form__login']}
        onSubmit={submitFormHandler}
      >
        <Input
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password, at least 6 characters."
          onInput={inputHandler}
        />
        <div className={styles['auth--form__btn-group']}>
          <Button buttonStyle={styles.forgot_password}>Forgot Password?</Button>
          <Button buttonStyle={styles.cta_button}>LOG IN</Button>
        </div>
      </form>
    </div>
  );

  return (
    <section className={styles.container}>
      <div>
        <div className={styles.auth}>
          {isLoginMode && (
            <div className={styles['auth--have-account-signup']}>
              <h1 className={styles['auth--have-account__title_signup']}>
                Don't Have an account?
              </h1>
              <p className={styles['auth--have-account__text']}>
                Create one to start managing like never before
              </p>
              <Button
                onClick={switchModeHandler}
                buttonStyle={styles.switch_button}
              >
                SIGN UP
              </Button>
            </div>
          )}
          {isLoginMode && loginForm}
          {!isLoginMode && signupForm}
          {!isLoginMode && (
            <div className={styles['auth--have-account-login']}>
              <h1 className={styles['auth--have-account__title_login']}>
                Have an account?
              </h1>
              <p className={styles['auth--have-account__text']}>
                Log in to your account
              </p>
              <Button
                onClick={switchModeHandler}
                buttonStyle={styles.switch_button}
              >
                LOG IN
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Auth;
