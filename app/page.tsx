"use client";

import { UnitsI, useWeatherContext } from "@/components/contextProvider/WeatherContextProvider";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import {
  DailyForecast,
  HourlyForecast,
  WeatherComponentsI,
  WeatherDataI,
  WeatherState,
} from "@/constants";
import useGetWeather from "@/hooks/get-weather";
import { useEffect, useState } from "react";

const dayString = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Home() {
  const { loadWeatherDetails } = useGetWeather();
  const { location, units } = useWeatherContext();
  const [weather, setWeather] = useState<WeatherState>({
    data: null,
    status: "idle",
    error: null,
  });

  useEffect(() => {
    if (!location) return;

    let cancelled = false;

    async function fetchWeather() {
      setWeather((prev) => ({ ...prev, status: "loading" }));

      try {
        const { currentWeather } = await loadWeatherDetails(location, units);
        if (!currentWeather || cancelled) return;

        const weatherComponentsData: WeatherComponentsI[] = [
          {
            id: 1,
            title: "Feels Like",
            value: `${Math.round(Number(currentWeather.current[0]))}°`,
            unit: "",
          },
          {
            id: 2,
            title: "Humidity",
            value: `${Math.round(Number(currentWeather.current[1]))}%`,
            unit: "",
          },
          {
            id: 3,
            title: "Wind",
            value: `${Math.round(Number(currentWeather.current[2]))} ${
              units.windSpeed === "mph" ? "mph" : "km/h"
            }`,
            unit: "",
          },
          {
            id: 4,
            title: "Precipitation",
            value: `${Math.round(Number(currentWeather.current[3]))} ${
              units.precipitation === "in" ? "in" : "mm"
            }`,
            unit: "",
          },
        ];

        const dailyData: DailyForecast[] = Array.from(
          { length: currentWeather.daily.time.length },
          (_, index) => ({
            day: dayString[currentWeather.daily.time[index].getDay()],
            minTemp: Math.round(currentWeather.daily.temperature_2m_min![index]),
            maxTemp: Math.round(currentWeather.daily.temperature_2m_max![index]),
            imgLink: currentWeather.daily.weather_code![index],
          }),
        );

        const fullDayString = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const hourlyData: HourlyForecast[] = Array.from(
          { length: currentWeather.hourly.time.length },
          (_, index) => {
            const timeObj = currentWeather.hourly.time[index];
            return {
              day: fullDayString[timeObj.getDay()],
              timestamp: timeObj.getTime(),
              hour: timeObj.toLocaleTimeString("en-US", {
                hour: "numeric",
                hour12: true,
              }),
              temperature: Math.round(  
                currentWeather.hourly.temperature_2m![index],
              ).toString(),
              imgLink: currentWeather.hourly.weather_code![index],
            };
          },
        );

        const data: WeatherDataI = {
          currentTemp: currentWeather.currentTemp,
          weatherCode: currentWeather.currentWeatherCode,
          weatherComponents: weatherComponentsData,
          dailyForecast: dailyData,
          hourlyForecast: hourlyData,
        };

        if (!cancelled) {
          setWeather({
            data,
            status: "success",
            error: null,
          });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setWeather({
            data: null,
            status: "error",
            error: err instanceof Error ? err.message : "Failed to fetch weather data",
          });
        }
      }
    }

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [location, units, loadWeatherDetails]);
  return (
    <div className="min-h-screen font-sans dark:bg-Neutral-900">
      <Header units={units} />
      <main className="min-h-screen w-full py-1">
        <h1 className="text-white font-bold text-center md:text-4xl text-5xl mb-10 px-4">
          How&apos;s the sky looking today?
        </h1>

        <SearchBar />

        <WeatherDisplay weather={weather} location={location} />
      </main>
    </div>
  );
}
