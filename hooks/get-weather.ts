import { Location } from "@/constants";
import { fetchWeatherApi } from "openmeteo";
import { useCallback } from "react";

export default function useGetWeather() {
  const loadWeatherDetails = useCallback(async (location: Location) => {
    const params = {
      latitude: location.lat,
      longitude: location.long,
      daily: ["temperature_2m_max", "temperature_2m_min"],
      hourly: "temperature_2m",
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "wind_speed_10m",
        "precipitation",
      ],
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    console.log(response);
    // Attributes for timezone and location
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
      `\nCoordinates: ${latitude}°N ${longitude}°E`,
      `\nElevation: ${elevation}m asl`,
      `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
    );

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        relative_humidity_2m: current.variables(1)!.value(),
        apparent_temperature: current.variables(2)!.value(),
        wind_speed_10m: current.variables(3)!.value(),
        precipitation: current.variables(4)!.value(),
      },
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
      },
    };

    // The 'weatherData' object now contains a simple structure, with arrays of datetimes and weather information
    console.log(
      `\nCurrent time: ${weatherData.current.time}\n`,
      `\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`,
      `\nCurrent apparent_temperature: ${weatherData.current.apparent_temperature}`,
      `\nCurrent wind_speed_10m: ${weatherData.current.wind_speed_10m}`,
      `\nCurrent precipitation: ${weatherData.current.precipitation}`
    );
    console.log("\nHourly data:\n", weatherData.hourly);
    console.log("\nDaily data:\n", weatherData.daily);

    const currentWeather = {
      locationInfo: "",
      currentTemp: current.variables(0)!.value(),
    };
    return { currentWeather };
  }, []);
  return { loadWeatherDetails };
}
