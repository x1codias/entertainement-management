import { useState } from 'react';

export const useFilter = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null,
  });

  const multipleCheckChangeHandler = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter((e) => e !== value));
    }
  };

  const checkChangeHandler = (e) => {
    setSelectedOption(e.target.value);
  };

  return {
    selectedOptions,
    selectedOption,
    selectedDayRange,
    multipleCheckChangeHandler,
    checkChangeHandler,
    setSelectedDayRange,
  };
};
