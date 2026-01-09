"use client";
import { WeatherContext } from "@/components/contextProvider/WeatherContextProvider";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import {
  currentWeather,
  DailyForecast,
  dailyForecastSample,
  HourlyForecast,
  hourlyForecastSample,
  WeatherComponents,
  weatherComponentsSample,
} from "@/constants";
import useGetWeather from "@/hooks/get-weather";
import { useContext, useEffect, useState } from "react";

const dayString = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default function Home() {
  const { loadWeatherDetails } = useGetWeather();
  const { location } = useContext(WeatherContext)!;
  const [loading, setLoading] = useState(false);
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

    let cancelled = false;

    async function fetchWeather() {
      const { currentWeather } = await loadWeatherDetails(location);
      if (!currentWeather || cancelled) return;

      setCurrentWeather({
        currentTemp: currentWeather.currentTemp,
        weatherCode: currentWeather.currentWeatherCode,
      });

      setWeatherComponents((prev) =>
        prev.map((weather, index) => ({
          ...weather,
          value: String(currentWeather.current[index]),
        }))
      );
      setDailyForecast((prev) =>
        prev.map((dailFore, index) => ({
          ...dailFore,
          day: dayString[currentWeather?.daily.time[index].getDay()],
          minTemp: Math.round(currentWeather.daily.temperature_2m_min![index]),
          maxTemp: Math.round(currentWeather.daily.temperature_2m_max![index]),
          imgLink: currentWeather.daily.weather_code![index],
        }))
      );
      setHourlyForecast((prev) =>
        prev.map((item, index) => ({
          ...item,
          temperature: Math.round(
            currentWeather.hourly.temperature_2m![index]
          ).toString(),
          imgLink: currentWeather.hourly.weather_code![index], // store weatherCode
          hour: currentWeather.hourly.time[index].toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
          }),
        }))
      );
    }

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [location, loadWeatherDetails]);
  return (
    <div className="min-h-screen font-sans dark:bg-Neutral-900">
      <Header />
      <main className="min-h-screen w-full py-1">
        <h1 className="text-white font-bold text-center md:text-4xl text-5xl mb-10 px-4">
          How&apos;s the sky looking today?
        </h1>

        <SearchBar />

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
