import { useEffect, useReducer } from 'react';
import { validate } from '../utils/validators';
import styles from './Input.module.css';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (e) => {
    dispatch({
      type: 'CHANGE',
      val: e.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: 'TOUCH' });
  };

  return (
    <div
      className={`${styles['auth--form__group']} ${
        !inputState.isValid &&
        inputState.isTouched &&
        styles['form-control--invalid']
      }`}
    >
      <label htmlFor={props.id} className={styles['auth--form__label']}>
        {props.label}
      </label>
      <input
        className={styles['auth--form__input']}
        type={props.type}
        id={props.id}
        value={inputState.value}
        onChange={changeHandler}
        onBlur={touchHandler}
      />
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
