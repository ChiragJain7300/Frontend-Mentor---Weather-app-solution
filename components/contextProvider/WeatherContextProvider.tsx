"use client";
import {
  currentWeather,
  DailyForecast,
  HourlyForecast,
  LocationObj,
} from "@/constants";
import { createContext, ReactNode, useContext, useState } from "react";
interface WeatherContextI {
  location: LocationObj;
  setLocation: React.Dispatch<React.SetStateAction<LocationObj>>;
  dailyWeatherData?: DailyForecast[];
  hourlyWeatherData?: HourlyForecast[];
  currentWeatherData?: currentWeather;
}
export const WeatherContext = createContext<WeatherContextI | null>(null);
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
  return (
    <WeatherContext.Provider
      value={{
        location,
        setLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error(
      "useWeatherContext must be used inside WeatherContextProvider"
    );
  }

  return context;
}
