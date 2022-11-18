import { Link } from 'react-router-dom';

import './Button.css';

const Button = (props) => {
  if (props.to) {
    return (
      <Link
        className={`button ${props.login && 'button--login'} ${
          props.signup && 'button--signup'
        } ${props.card && 'button--card'}`}
        to={props.to}
        exact={props.exact}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      className={`button ${props.login && 'button--login'} ${
        props.signup && 'button--signup'
      } ${props.card && 'button--card'}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
