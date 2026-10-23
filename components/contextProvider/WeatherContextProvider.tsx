"use client";
import {
  LocationObj,
} from "@/constants";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
export interface UnitsI {
  temp: "C" | "F";
  windSpeed: "kmh" | "mph";
  precipitation: "mm" | "in";
}
interface WeatherContextI {
  location: LocationObj;
  setLocation: React.Dispatch<React.SetStateAction<LocationObj>>;
  units: UnitsI;
  setUnits: React.Dispatch<React.SetStateAction<UnitsI>>;
}
const WeatherContext = createContext<WeatherContextI | null>(null);
export default function WeatherContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [location, setLocation] = useState<LocationObj>({
    lat: 28.65195,
    long: 77.23149,
    locationCity: "Delhi",
    locationCountry: "India",
  });
  const [units, setUnits] = useState<UnitsI>({
    temp: "C",
    windSpeed: "kmh",
    precipitation: "mm",
  });
  // Memoize value so consumers don't re-render unnecessarily
  const value = useMemo(
    () => ({ location, setLocation, units, setUnits }),
    [location, units],
  );
  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error(
      "useWeatherContext must be used inside WeatherContextProvider",
    );
  }

  return context;
}
