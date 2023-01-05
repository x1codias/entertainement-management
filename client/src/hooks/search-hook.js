import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useSearch = () => {
  const location = useLocation();
  const [inputText, setInputText] = useState('');

  const changeHandler = (e) => {
    setInputText(e.target.value);
  };

  // to persist data
  useEffect(() => {
    if (location.pathname !== location.state?.from) {
      localStorage.removeItem('searchInput');
    }
    const searchInput = localStorage.getItem('searchInput');
    searchInput !== null && setInputText(searchInput);
  }, [location]);

  useEffect(() => {
    localStorage.setItem('searchInput', inputText);
  }, [inputText]);

  return { inputText, changeHandler };
};
