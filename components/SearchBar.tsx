"use client";
import { LocationObj } from "@/constants";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useWeatherContext } from "./contextProvider/WeatherContextProvider";

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const { setLocation } = useWeatherContext();
  const [locationArr, setLocationArr] = useState<LocationObj[]>([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const query = searchText.trim();
    if (!query) return;

    setLoading(true);
    setNoResults(false);
    setLocationArr([]);
    setIsOpen(true);

    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query,
        )}&count=5&language=en&format=json`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await res.json();
      if (data?.results && data.results.length > 0) {
        const locations: LocationObj[] = data.results.map(
          (item: GeocodingResult) => ({
            long: item.longitude,
            lat: item.latitude,
            locationCity: item.name,
            locationState: item.admin1,
            locationCountry: item.country,
          }),
        );
        setLocationArr(locations);
        setNoResults(false);
      } else {
        setLocationArr([]);
        setNoResults(true);
      }
    } catch (err) {
      console.error("Geocoding search error:", err);
      setLocationArr([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (item: LocationObj) => {
    setLocation(item);
    setLocationArr([]);
    setIsOpen(false);
    setNoResults(false);
    setSearchText(
      [item.locationCity, item.locationCountry].filter(Boolean).join(", "),
    );
  };

  return (
    <div className="mb-8 px-4" ref={containerRef}>
      <form
        className="w-full max-w-md xl:max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
        onSubmit={handleSearchSubmit}
      >
        <div className="relative flex-1">
          <Image
            src="/assets/images/icon-search.svg"
            alt="search-icon"
            width={18}
            height={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80"
          />
          <input
            type="text"
            name="searchBar"
            id="searchBar"
            className="w-full py-2.5 px-10 bg-Neutral-700 rounded-lg placeholder:text-Neutral-300 text-white border border-transparent focus:border-white focus:outline-none transition-all duration-200 text-sm"
            placeholder="Search for a place"
            value={searchText}
            autoComplete="off"
            onFocus={() => {
              if (locationArr.length > 0 || loading || noResults) {
                setIsOpen(true);
              }
            }}
            onChange={(e) => {
              setSearchText(e.currentTarget.value);
              if (noResults) setNoResults(false);
            }}
          />

          {isOpen && (
            <div className="absolute w-full top-[calc(100%+8px)] z-50 text-white">
              {loading && (
                <div className="flex items-center gap-3 bg-Neutral-800 border border-Neutral-600/60 rounded-lg py-3 px-4 shadow-2xl">
                  <Image
                    src="/assets/images/icon-loading.svg"
                    alt="loading-img"
                    width={16}
                    height={16}
                    className="animate-spin"
                  />
                  <p className="text-sm text-Neutral-200">Search in progress</p>
                </div>
              )}

              {!loading && locationArr.length > 0 && (
                <div className="flex flex-col bg-Neutral-800 border border-Neutral-600/60 rounded-lg shadow-2xl overflow-hidden py-1">
                  {locationArr.map((item, index) => {
                    const label = [
                      item.locationCity,
                      item.locationState,
                      item.locationCountry,
                    ]
                      .filter(Boolean)
                      .join(", ");

                    return (
                      <button
                        key={`${item.lat}-${item.long}-${index}`}
                        type="button"
                        className="hover:bg-Neutral-700/80 transition-colors px-4 py-2.5 cursor-pointer text-left text-sm text-Neutral-100 flex items-center justify-between"
                        onClick={() => handleSelectLocation(item)}
                      >
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {!loading && noResults && (
                <div className="flex items-center bg-Neutral-800 border border-Neutral-600/60 rounded-lg py-3 px-4 shadow-2xl text-sm text-Neutral-300">
                  <p>No search result found!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="border border-transparent bg-Blue-500 hover:bg-Blue-600 active:scale-[0.98] text-white px-5 rounded-lg cursor-pointer hover:border-white duration-200 py-2.5 font-medium text-sm transition-all"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
