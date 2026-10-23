export interface WeatherComponentsI {
  id: number;
  title: string;
  value: string;
  unit: string;
}
export interface DailyForecast {
  day: string;
  imgLink?: number;
  minTemp: number;
  maxTemp: number;
}
export interface HourlyForecast {
  imgLink?: number;
  hour: string;
  temperature: string;
  day?: string;
  timestamp?: number;
}
export interface LocationObj {
  long: number;
  lat: number;
  locationCity: string;
  locationState?: string;
  locationCountry?: string;
}
export interface WeatherDataI {
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  currentTemp: number;
  weatherCode?: number;
  weatherComponents?: WeatherComponentsI[];
}
export type WeatherState = {
  data: WeatherDataI | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
};
export const weatherComponents: WeatherComponentsI[] = [
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
    imgLink: -1,
    minTemp: 0,
    maxTemp: 0,
  }),
);
export const hourlyForecastSample: HourlyForecast[] = Array.from(
  { length: 24 },
  (_, i) => ({
    id: i, // 0–23 or use i + 1 if you prefer
    imgLink: -1,
    hour: "",
    temperature: "",
  }),
);
