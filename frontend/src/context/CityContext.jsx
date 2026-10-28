import React, { createContext, useContext, useState, useEffect } from 'react';

const CityContext = createContext();

export const CITIES = [
  'Mumbai',
  'Delhi-NCR',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Chennai',
  'Ahmedabad',
];

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('imovies_city') || 'Mumbai';
  });

  const changeCity = (city) => {
    setSelectedCity(city);
    localStorage.setItem('imovies_city', city);
  };

  return (
    <CityContext.Provider value={{ selectedCity, changeCity, cities: CITIES }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
