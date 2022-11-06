import { useState } from 'react';

export const useSearch = () => {
  const [inputText, setInputText] = useState('');

  const changeHandler = (e) => {
    setInputText(e.target.value);
  };

  return { inputText, changeHandler };
};
