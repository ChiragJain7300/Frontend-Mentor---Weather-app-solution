"use client";
import { Location } from "@/constants";
import Image from "next/image";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

const SearchBar = ({
  setLocation,
}: {
  setLocation: Dispatch<SetStateAction<Location>>;
}) => {
  const [searchText, setSearchText] = useState("");
  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${searchText}&count=1&language=en&format=json`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    if (data?.results) {
      const { results } = data;
      console.log("geo data", results);

      setLocation({
        lat: results[0].latitude,
        long: results[0].longitude,
        locationCity: results[0].name,
        locationCountry: results[0]?.admin1,
      });
    }
    setSearchText("");
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
            className="w-full py-2 px-9 bg-Neutral-600 rounded-lg placeholder:text-white text-white"
            placeholder="Search for a place"
            value={searchText}
            onChange={(e) => setSearchText(e.currentTarget.value)}
          />
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
