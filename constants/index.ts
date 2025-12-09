export interface WeatherComponents {
  id: number;
  title: string;
  value: string;
  unit: string;
}
export interface DailyForecast {
  id: number;
  day: string;
  imgLink?: string;
  minTemp: string;
  maxTemp: string;
}
export interface HourlyForecast {
  id: number; // 0–23 or use i + 1 if you prefer
  imgLink?: string;
  hour: string;
  temperature: string;
}
export interface Location {
  long: string;
  lat: string;
  locationCity: string;
  locationCountry?: string;
}
export interface currentWeather {
  locationInfo: string;
  currentTemp: number;
  imgLink?: string;
}
export const weatherComponentsSample: WeatherComponents[] = [
  {
    id: 1,
    title: "Feels Like",
    value: "-",
    unit: "",
  },
  {
    id: 2,
    title: "Humidity",
    value: "-",
    unit: "",
  },
  {
    id: 3,
    title: "Wind",
    value: "-",
    unit: "",
  },
  {
    id: 4,
    title: "Precipitation",
    value: "-",
    unit: "",
  },
];
export const dailyForecastSample: DailyForecast[] = Array.from(
  { length: 7 },
  (_, i) => ({
    id: i,
    day: "",
    imgLink: "",
    minTemp: "",
    maxTemp: "",
  })
);
export const hourlyForecastSample: HourlyForecast[] = Array.from(
  { length: 24 },
  (_, i) => ({
    id: i, // 0–23 or use i + 1 if you prefer
    imgLink: "",
    hour: "",
    temperature: "",
  })
);
