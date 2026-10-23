"use client";
import { LocationObj, weatherComponents, WeatherDataI, WeatherState } from "@/constants";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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

const shortToFullDayMap: Record<string, string> = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

const fullDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const WeatherDisplay = ({
  weather,
  location,
}: {
  weather: WeatherState;
  location: LocationObj;
}) => {
  const date = new Date();
  const { data } = weather;
  const dailyForecast = data?.dailyForecast ?? [];
  const hourlyForecast = data?.hourlyForecast ?? [];
  const components = data?.weatherComponents ?? weatherComponents;

  const [selectedDay, setSelectedDay] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Available days in chronological order from the forecast
  const availableDays = useMemo(() => {
    const days: string[] = [];
    hourlyForecast.forEach((item) => {
      if (item.day && !days.includes(item.day)) {
        days.push(item.day);
      }
    });
    return days.length > 0 ? days : fullDayNames;
  }, [hourlyForecast]);

  // Current active day
  const activeDay =
    selectedDay && availableDays.includes(selectedDay)
      ? selectedDay
      : availableDays[0] || fullDayNames[date.getDay()];

  // Filter hourly forecast by selected day:
  // For Today, show from current hour to end of day.
  // For other days, show all hours of that day.
  const filteredHourlyForecast = useMemo(() => {
    const isToday = activeDay === availableDays[0];
    const itemsForDay = hourlyForecast.filter((item) => item.day === activeDay);

    if (isToday) {
      const currentHourStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
      ).getTime();

      const futureHours = itemsForDay.filter(
        (item) =>
          item.timestamp !== undefined && item.timestamp >= currentHourStart,
      );

      return futureHours.length > 0 ? futureHours : itemsForDay;
    }

    return itemsForDay.length > 0 ? itemsForDay : hourlyForecast.slice(0, 24);
  }, [hourlyForecast, activeDay, availableDays, date]);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  return (
    <div className="w-full md:max-w-5xl xl:max-w-7xl mx-auto text-white p-4 mb-10">
      <div className="flex flex-col sm:flex-row gap-5 w-full">
        <div className="w-full sm:w-3/4 flex flex-col">
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex w-full min-h-48 bg-Neutral-700 rounded-xl">
              {data?.currentTemp !== undefined ? (
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
                        weatherCode={data.weatherCode!}
                        alt={"current weather code"}
                      />
                    </div>
                    <span className="text-7xl font-bold italic">
                      {Math.round(data.currentTemp)}°
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
              {components.map((item) => (
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

              {dailyForecast.map((item, index) => {
                const fullDay = shortToFullDayMap[item.day];
                const isSelected = fullDay === activeDay;
                return (
                  <div
                    key={`${item.day}-${index}`}
                    onClick={() => {
                      if (fullDay && availableDays.includes(fullDay)) {
                        setSelectedDay(fullDay);
                      }
                    }}
                    className={`bg-Neutral-700 rounded-lg min-h-28 flex flex-col items-center p-2 justify-between cursor-pointer transition-all duration-200 hover:bg-Neutral-600 ${
                      isSelected ? "ring-2 ring-Blue-500 bg-Neutral-600" : ""
                    }`}
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
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/4 min-h-96 bg-Neutral-700 min-w-44 rounded-md p-3">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs md:text-sm font-medium">Hourly forecast</p>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="border border-transparent py-1 px-2.5 rounded-md flex items-center gap-2 bg-Neutral-600 cursor-pointer hover:border-white duration-300"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="listbox"
              >
                <p className="text-[10px] md:text-xs font-medium">{activeDay}</p>
                <Image
                  src="/assets/images/icon-dropdown.svg"
                  alt="dropdown-icon"
                  width={10}
                  height={10}
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-36 bg-Neutral-800 border border-Neutral-600/70 rounded-lg shadow-2xl py-1.5 px-1 z-50 flex flex-col gap-0.5"
                  role="listbox"
                >
                  {availableDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      role="option"
                      aria-selected={day === activeDay}
                      onClick={() => {
                        setSelectedDay(day);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                        day === activeDay
                          ? "bg-Neutral-600 text-white font-semibold"
                          : "text-Neutral-200 hover:bg-Neutral-700 hover:text-white"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 h-96 overflow-y-auto">
            {filteredHourlyForecast.map((item, index) => (
              <div
                key={`${item.hour}-${index}`}
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
