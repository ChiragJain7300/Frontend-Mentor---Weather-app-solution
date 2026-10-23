"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { UnitsI, useWeatherContext } from "./contextProvider/WeatherContextProvider";

interface HeaderProps {
  units?: UnitsI;
}

const Header = ({ units: propsUnits }: HeaderProps) => {
  const { units: contextUnits, setUnits } = useWeatherContext();
  const units = contextUnits || propsUnits || {
    temp: "C",
    windSpeed: "kmh",
    precipitation: "mm",
  };
  const [menuToggle, setMenuToggle] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAllImperial =
    units.temp === "F" &&
    units.windSpeed === "mph" &&
    units.precipitation === "in";

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuToggle(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuToggle(false);
      }
    };

    if (menuToggle) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuToggle]);

  const handleToggleSystem = () => {
    if (isAllImperial) {
      setUnits({
        temp: "C",
        windSpeed: "kmh",
        precipitation: "mm",
      });
    } else {
      setUnits({
        temp: "F",
        windSpeed: "mph",
        precipitation: "in",
      });
    }
  };

  return (
    <header className="w-full">
      <div className="w-full md:max-w-5xl xl:max-w-6xl mx-auto flex items-center justify-between py-8 px-4">
        <div>
          <Image
            src="/assets/images/logo.svg"
            alt="Weather Now logo"
            width={200}
            height={100}
            priority
            className="w-36 sm:w-52 h-auto"
          />
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="py-2 px-3 border border-Neutral-600 rounded-lg flex items-center gap-2 bg-Neutral-700 cursor-pointer hover:border-white duration-200 shadow-sm"
            onClick={() => setMenuToggle((prev) => !prev)}
            aria-expanded={menuToggle}
            aria-label="Unit preferences"
          >
            <Image
              src="/assets/images/icon-units.svg"
              alt="units-icon"
              width={14}
              height={14}
            />
            <p className="text-white text-xs font-medium">Units</p>
            <Image
              src="/assets/images/icon-dropdown.svg"
              alt="dropdown-icon"
              width={10}
              height={10}
              className={`transition-transform duration-200 ${
                menuToggle ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuToggle && (
            <div className="w-56 bg-Neutral-800 border border-Neutral-600/70 text-white absolute right-0 top-[calc(100%+8px)] py-2 px-1 text-xs rounded-xl shadow-2xl z-50 flex flex-col">
              {/* Quick Switch */}
              <button
                type="button"
                onClick={handleToggleSystem}
                className="cursor-pointer hover:bg-Neutral-700/80 w-full py-2 px-3 text-start rounded-lg font-medium transition-colors text-xs text-Neutral-100"
              >
                {isAllImperial ? "Switch to Metric" : "Switch to Imperial"}
              </button>

              <div className="h-px bg-Neutral-700/80 my-1.5" />

              {/* Temperature */}
              <div className="flex flex-col">
                <span className="text-[10px] text-Neutral-400 font-medium px-3 py-1 uppercase tracking-wider">
                  Temperature
                </span>
                <button
                  type="button"
                  onClick={() => setUnits((prev) => ({ ...prev, temp: "C" }))}
                  className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg hover:bg-Neutral-700/80 cursor-pointer transition-colors text-xs"
                >
                  <span
                    className={
                      units.temp === "C"
                        ? "text-white font-medium"
                        : "text-Neutral-300"
                    }
                  >
                    Celsius (°C)
                  </span>
                  {units.temp === "C" && (
                    <Image
                      src="/assets/images/icon-checkmark.svg"
                      alt="selected"
                      width={12}
                      height={12}
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setUnits((prev) => ({ ...prev, temp: "F" }))}
                  className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg hover:bg-Neutral-700/80 cursor-pointer transition-colors text-xs"
                >
                  <span
                    className={
                      units.temp === "F"
                        ? "text-white font-medium"
                        : "text-Neutral-300"
                    }
                  >
                    Fahrenheit (°F)
                  </span>
                  {units.temp === "F" && (
                    <Image
                      src="/assets/images/icon-checkmark.svg"
                      alt="selected"
                      width={12}
                      height={12}
                    />
                  )}
                </button>
              </div>

              <div className="h-px bg-Neutral-700/80 my-1.5" />

              {/* Wind Speed */}
              <div className="flex flex-col">
                <span className="text-[10px] text-Neutral-400 font-medium px-3 py-1 uppercase tracking-wider">
                  Wind Speed
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setUnits((prev) => ({ ...prev, windSpeed: "kmh" }))
                  }
                  className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg hover:bg-Neutral-700/80 cursor-pointer transition-colors text-xs"
                >
                  <span
                    className={
                      units.windSpeed === "kmh"
                        ? "text-white font-medium"
                        : "text-Neutral-300"
                    }
                  >
                    km/h
                  </span>
                  {units.windSpeed === "kmh" && (
                    <Image
                      src="/assets/images/icon-checkmark.svg"
                      alt="selected"
                      width={12}
                      height={12}
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setUnits((prev) => ({ ...prev, windSpeed: "mph" }))
                  }
                  className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg hover:bg-Neutral-700/80 cursor-pointer transition-colors text-xs"
                >
                  <span
                    className={
                      units.windSpeed === "mph"
                        ? "text-white font-medium"
                        : "text-Neutral-300"
                    }
                  >
                    mph
                  </span>
                  {units.windSpeed === "mph" && (
                    <Image
                      src="/assets/images/icon-checkmark.svg"
                      alt="selected"
                      width={12}
                      height={12}
                    />
                  )}
                </button>
              </div>

              <div className="h-px bg-Neutral-700/80 my-1.5" />

              {/* Precipitation */}
              <div className="flex flex-col">
                <span className="text-[10px] text-Neutral-400 font-medium px-3 py-1 uppercase tracking-wider">
                  Precipitation
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setUnits((prev) => ({ ...prev, precipitation: "mm" }))
                  }
                  className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg hover:bg-Neutral-700/80 cursor-pointer transition-colors text-xs"
                >
                  <span
                    className={
                      units.precipitation === "mm"
                        ? "text-white font-medium"
                        : "text-Neutral-300"
                    }
                  >
                    Millimeters (mm)
                  </span>
                  {units.precipitation === "mm" && (
                    <Image
                      src="/assets/images/icon-checkmark.svg"
                      alt="selected"
                      width={12}
                      height={12}
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setUnits((prev) => ({ ...prev, precipitation: "in" }))
                  }
                  className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg hover:bg-Neutral-700/80 cursor-pointer transition-colors text-xs"
                >
                  <span
                    className={
                      units.precipitation === "in"
                        ? "text-white font-medium"
                        : "text-Neutral-300"
                    }
                  >
                    Inches (in)
                  </span>
                  {units.precipitation === "in" && (
                    <Image
                      src="/assets/images/icon-checkmark.svg"
                      alt="selected"
                      width={12}
                      height={12}
                    />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
