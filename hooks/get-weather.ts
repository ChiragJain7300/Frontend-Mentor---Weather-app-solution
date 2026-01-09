import { LocationObj } from "@/constants";
import { fetchWeatherApi } from "openmeteo";
import { useCallback } from "react";

export default function useGetWeather() {
  const loadWeatherDetails = useCallback(async (location: LocationObj) => {
    const params = {
      latitude: location.lat,
      longitude: location.long,
      daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"],
      hourly: ["temperature_2m", "weather_code"],
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "wind_speed_10m",
        "precipitation",
        "weather_code",
      ],
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: [
        current.variables(2)!.value().toFixed(2).toString(),
        current.variables(1)!.value().toString(),
        current.variables(3)!.value().toFixed(2).toString(),
        current.variables(4)!.value().toString(),
      ],
      hourly: {
        time: Array.from(
          {
            length:
              (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval(),
          },
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000
            )
        ),
        temperature_2m: hourly.variables(0)!.valuesArray(),
        weather_code: hourly.variables(1)!.valuesArray(),
      },
      daily: {
        time: Array.from(
          {
            length:
              (Number(daily.timeEnd()) - Number(daily.time())) /
              daily.interval(),
          },
          (_, i) =>
            new Date(
              (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
                1000
            )
        ),
        temperature_2m_max: daily.variables(0)!.valuesArray(),
        temperature_2m_min: daily.variables(1)!.valuesArray(),
        weather_code: daily.variables(2)!.valuesArray(),
      },
    };

    const currentWeather = {
      currentTemp: current.variables(0)!.value(),
      current: weatherData?.current,
      daily: weatherData?.daily,
      hourly: weatherData?.hourly,
      currentWeatherCode: current.variables(5)!.value(),
    };
    return { currentWeather };
  }, []);
  return { loadWeatherDetails };
}
