"use client";
import { LocationObj } from "@/constants";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useWeatherContext } from "./contextProvider/WeatherContextProvider";

const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const { setLocation } = useWeatherContext();
  const [locationArr, setLocationArr] = useState<LocationObj[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    setLoading(true);
    setLocationArr([]);
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${searchText}&count=5&language=en&format=json`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    if (data?.results) {
      const { results } = data;
      console.log("geo data", results);
      setLocationArr(
        results.map((item: any) => ({
          long: item.longitude,
          lat: item.latitude,
          locationCity: item.name,
          locationState: item.admin1,
          locationCountry: item.country,
        }))
      );
      setLoading(false);
      // setLocation({
      //   lat: results[0].latitude,
      //   long: results[0].longitude,
      //   locationCity: results[0].name,
      //   locationCountry: results[0]?.admin1,
      // });
    }
  };
  return (
    <div className="mb-5 px-4">
      <form
        className="w-full max-w-md xl:max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
        onSubmit={handleSearchSubmit}
      >
        <div className="relative flex-1">
          {" "}
          <Image
            src="/assets/images/icon-search.svg"
            alt="search-icon"
            width={16}
            height={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            name="searchBar"
            id="searchBar"
            className="w-full py-2 px-9 bg-Neutral-700 rounded-lg placeholder:text-white text-white border border-transparent"
            placeholder="Search for a place"
            value={searchText}
            onChange={(e) => setSearchText(e.currentTarget.value)}
          />
          <div className="absolute w-full top-13 z-50 text-white">
            {loading && locationArr.length === 0 && (
              <div className="flex items-center gap-2 bg-Neutral-700 rounded-lg py-2 px-4">
                <Image
                  src={"/assets/images/icon-loading.svg"}
                  alt="loading-img"
                  width={10}
                  height={10}
                />
                <p>Search in progress</p>
              </div>
            )}
            {!loading && locationArr.length > 0 && (
              <div className="flex flex-col bg-Neutral-700 rounded-lg">
                {locationArr.map((item, index) => (
                  <div
                    key={index}
                    className="hover:bg-Neutral-600 transition-colors px-4 py-2 cursor-pointer rounded-lg"
                  >
                    {item.locationCity}, {item.locationState},{" "}
                    {item.locationCountry}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          className="border border-transparent bg-Blue-500 text-white px-3 rounded-lg cursor-pointer hover:border-white duration-300 py-2"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
