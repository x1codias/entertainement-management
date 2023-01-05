import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useHttpClient } from './http-hook';

export const useSort = (
  urlRelevant,
  urlPopular,
  urlTopRated,
  urlLatest,
  urlUpcoming,
  setLoadedData
) => {
  const [selectedSort, setSelectedSort] = useState('');
  const { sendRequest } = useHttpClient();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== location.state?.from) {
      localStorage.removeItem('selectedSort');
    }
    const sort = localStorage.getItem('selectedSort');
    sort !== null && setSelectedSort(sort);
  }, [location]);

  useEffect(() => {
    localStorage.setItem('selectedSort', selectedSort);
    const sortData = async () => {
      if (selectedSort === 'Relevance') {
        try {
          const relevantData = await sendRequest(urlRelevant);

          console.log(relevantData);

          setLoadedData(relevantData.results);
        } catch (err) {}
      }

      if (selectedSort === 'Popularity') {
        try {
          const popularData = await sendRequest(urlPopular);

          console.log(popularData);

          setLoadedData(popularData.results);
        } catch (err) {}
      }

      if (selectedSort === 'Rating') {
        try {
          const topRatedData = await sendRequest(urlTopRated);

          console.log(topRatedData);

          setLoadedData(topRatedData.results);
        } catch (err) {}
      }

      if (selectedSort === 'Latest') {
        try {
          const latestData = await sendRequest(urlLatest);

          console.log(latestData);

          setLoadedData(latestData.results);
        } catch (err) {}
      }

      if (selectedSort === 'Upcoming') {
        try {
          const upcomingData = await sendRequest(urlUpcoming);

          console.log(upcomingData);

          setLoadedData(upcomingData.results);
        } catch (err) {}
      }
    };
    sortData();
  }, [
    sendRequest,
    selectedSort,
    urlLatest,
    urlPopular,
    urlRelevant,
    urlTopRated,
    urlUpcoming,
    setLoadedData,
  ]);

  const sortClickHandler = (e) => {
    e.preventDefault();
    setSelectedSort(e.target.outerText);
    console.log(selectedSort);
  };

  return { selectedSort, sortClickHandler };
};
