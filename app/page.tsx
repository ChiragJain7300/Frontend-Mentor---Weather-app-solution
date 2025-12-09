"use client";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import {
  currentWeather,
  DailyForecast,
  dailyForecastSample,
  HourlyForecast,
  hourlyForecastSample,
  Location,
  WeatherComponents,
  weatherComponentsSample,
} from "@/constants";
import useGetWeather from "@/hooks/get-weather";
import { useEffect, useState } from "react";

export default function Home() {
  const { loadWeatherDetails } = useGetWeather();
  const [location, setLocation] = useState<Location>({
    long: "73.71346",
    lat: "24.58584",
    locationCity: "Delhi",
    locationCountry: "India",
  });
  const [weatherComponents, setWeatherComponents] = useState<
    WeatherComponents[]
  >(weatherComponentsSample);
  const [hourlyForecast, setHourlyForecast] =
    useState<HourlyForecast[]>(hourlyForecastSample);
  const [dailyForecast, setDailyForecast] =
    useState<DailyForecast[]>(dailyForecastSample);

  const [currentWeather, setCurrentWeather] = useState<currentWeather | null>(
    null
  );
  useEffect(() => {
    if (!location) return;
    (async function getWeather() {
      const data = await loadWeatherDetails(location);
      if (data) {
        setCurrentWeather(data?.currentWeather);
      }
      console.log(data);
    })();
  }, [location, loadWeatherDetails]);

  return (
    <div className="min-h-screen font-sans dark:bg-Neutral-900">
      <Header />
      <main className="min-h-screen w-full py-1">
        <h1 className="text-white font-bold text-center md:text-4xl text-5xl mb-10 px-4">
          How&apos;s the sky looking today?
        </h1>

        <SearchBar setLocation={setLocation} />

        <WeatherDisplay
          currentWeather={currentWeather}
          dailyForecast={dailyForecast}
          hourlyForecast={hourlyForecast}
          weatherComponents={weatherComponents}
        />
      </main>
    </div>
  );
}
