"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";


interface CityContextType {
  city: string | null;
  area: string | null;
  setCity: (city: string) => void;
  setArea: (area: string) => void;

  initializeLocation: (
    city: string,
    area?: string,
  ) => void;

  isLoaded: boolean;
}

const CityContext = createContext<CityContextType | undefined>(
  undefined
);

export function CityProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [city, setCityState] = useState<string | null>(null);
  const [area, setAreaState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {

    const storedCity = localStorage.getItem("selectedCity");
    const storedArea = localStorage.getItem("selectedArea");

    if (storedCity) setCityState(storedCity);
    if (storedArea) setAreaState(storedArea);

    setIsLoaded(true);

  }, []);

  function setCity(newCity: string) {

    localStorage.setItem("selectedCity", newCity);
    setCityState(newCity);

    setAreaState(null);
    localStorage.removeItem("selectedArea");

  }

  function setArea(area: string) {
    localStorage.setItem("selectedArea", area);
    setAreaState(area);
  }

  function initializeLocation(newCity: string, newArea?: string) {
    localStorage.setItem('selectedCity', newCity);
    setCityState(newCity);

    if (newArea) {
      localStorage.setItem('selectedArea', newArea);
      setAreaState(newArea);
    } else {
      localStorage.removeItem('selectedArea');
      setAreaState(null);
    }
  }

  return (
    <CityContext.Provider
      value={{
        city,
        area,
        setCity,
        setArea,
        initializeLocation,
        isLoaded,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {

  const context = useContext(CityContext);

  if (!context) {
    throw new Error("useCity must be used inside CityProvider");
  }

  return context;
}