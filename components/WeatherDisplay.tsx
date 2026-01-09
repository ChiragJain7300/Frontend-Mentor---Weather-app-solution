"use client";
import {
  currentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherComponents,
} from "@/constants";
import Image from "next/image";
import { useContext } from "react";
import { WeatherContext } from "./contextProvider/WeatherContextProvider";
export function EmojiDisplay({
  weatherCode,
  alt,
}: {
  weatherCode: number;
  alt?: string;
}) {
  let imgLink = "";

  switch (weatherCode) {
    case 2:
      imgLink = "icon-partly-cloudy.webp";
      break;

    case 3:
      imgLink = "icon-overcast.webp";
      break;

    case 45:
    case 48:
      imgLink = "icon-fog.webp";
      break;

    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      imgLink = "icon-drizzle.webp";
      break;

    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      imgLink = "icon-rain.webp";
      break;

    case 71:
    case 73:
    case 75:
    case 77:
      imgLink = "icon-snow.webp";
      break;

    case 96:
    case 95:
    case 99:
      imgLink = "icon-storm.webp";
      break;
    default:
      imgLink = "icon-sunny.webp";
  }

  return (
    <Image src={"/assets/images/" + imgLink} fill alt={alt || ""} sizes="" />
  );
}
const WeatherDisplay = ({
  currentWeather,
  weatherComponents,
  hourlyForecast,
  dailyForecast,
}: {
  currentWeather: currentWeather | null;
  weatherComponents: WeatherComponents[];
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
}) => {
  const { location } = useContext(WeatherContext)!;
  const date = new Date();
  return (
    <div className="w-full md:max-w-4xl xl:max-w-7xl mx-auto text-white p-4 mb-10">
      <div className="flex flex-col sm:flex-row gap-5 w-full">
        <div className="w-full sm:w-3/4 flex flex-col">
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex w-full min-h-48 bg-Neutral-700 rounded-xl">
              {currentWeather?.currentTemp ? (
                <div className="w-full h-full bg-[url('/assets/images/bg-today-large.svg')] rounded-xl bg-cover bg-center p-4 flex items-center justify-between">
                  {" "}
                  <div>
                    <h1 className="text-2xl font-bold">
                      {location.locationCity}, {location.locationCountry}
                    </h1>
                    <p>
                      {date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 h-20 relative">
                      {/* Image */}
                      <EmojiDisplay
                        weatherCode={currentWeather.weatherCode!}
                        alt={"current weather code"}
                      />
                    </div>
                    <span className="text-7xl font-bold italic">
                      {Math.round(currentWeather.currentTemp)}°
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center w-full">
                  <h1 className="text-center font-bold">Loading...</h1>
                </div>
              )}
            </div>
            <div className="grid w-full gap-3 grid-cols-2 sm:grid-cols-4">
              {weatherComponents.map((item) => (
                <div
                  key={item.id}
                  className="min-h-20 rounded-lg bg-Neutral-700 p-3 flex flex-col justify-around"
                >
                  <h3 className="text-xs">{item.title}</h3>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold mb-3">Daily forecast</h2>
            <div className="w-full grid grid-cols-3 sm:grid-cols-7 gap-2">
              {/* 7 day */}

              {dailyForecast.map((item) => (
                <div
                  key={item.id}
                  className="bg-Neutral-700 rounded-lg min-h-28 flex flex-col items-center p-2 justify-between"
                >
                  <h3>{item.day}</h3>
                  <div className="relative h-8 w-8">
                    <EmojiDisplay
                      weatherCode={item.imgLink!}
                      alt="daily forecast codes"
                    />
                  </div>
                  <div className="w-full flex items-center justify-between">
                    {item.maxTemp !== 0 && <span>{item.maxTemp}°</span>}
                    {item.minTemp !== 0 && <span>{item.minTemp}°</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/4 min-h-96 bg-Neutral-700 min-w-44 rounded-md p-3">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs md:text-sm">Hourly forecast</p>
            <button className="border border-transparent py-0.5 px-2 rounded-md flex gap-2 bg-Neutral-600 cursor-pointer hover:border-white duration-300">
              <p>-</p>{" "}
              <Image
                src="/assets/images/icon-dropdown.svg"
                alt="dropdown-icon"
                width={12}
                height={12}
              />
            </button>
          </div>

          <div className="w-full flex flex-col gap-2 h-96 overflow-y-auto">
            {hourlyForecast.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg w-full min-h-10 bg-Neutral-600 px-2 py-1 text-sm"
              >
                <div className="flex gap-1 items-center font-semibold">
                  <div className="relative w-6 h-6">
                    <EmojiDisplay weatherCode={item.imgLink!} />
                  </div>
                  <p>{item.hour}</p>
                </div>

                <p className="text-xs italic">{item.temperature}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
