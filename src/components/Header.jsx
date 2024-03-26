import { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import debounce from "lodash/debounce";
import searchIcon from "../assets/icons/Search.svg";
import { CLIENT_ID, CLIENT_SECRET } from "../constants";

function Header({ searchQuery, onSearchQueryChange, onProfileClick }) {
  const [foundUsers, setFoundUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Debounce the fetch function to avoid making too many requests in a short time
  const debouncedFetchData = debounce(fetchData, 500);

  async function fetchData() {
    if (searchQuery) {
      setIsLoading(true);
      try {
        const headers = new Headers();
        headers.append(
          "Authorization",
          `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        );

        const url = `https://api.github.com/search/users?q=${searchQuery}`;

        // Fetch data from the API
        const response = await fetch(url, {
          method: "GET",
          headers: headers,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        // Parse the json response
        const jsonData = await response.json();

        // Update the state with fetched data
        setFoundUsers(jsonData.items);
        setIsLoading(false);
      } catch (error) {
        // Handle Errors
        console.log(error.message);
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    // Call fetchData when searchQuery changes or component mounts
    debouncedFetchData();

    // Clean up debounce function
    return () => {
      debouncedFetchData.cancel();
    };
  }, [searchQuery]); // Run effect when searchQuery changes

  return (
    <div
      id="header"
      className="h-[240px] w-full bg-center bg-cover bg-no-repeat bg-[url('./assets/images/hero-image-github-profile.png')] flex justify-center"
    >
      <div>
        <form onSubmit={handleSubmit} className="relative mt-8 mb-2 self-start">
          <span className="absolute top-4 left-5">
            <img src={searchIcon} />
          </span>
          <input
            type="text"
            placeholder="username"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="bg-gray text-slate-100 placeholder-slate-300 p-4 pl-12 rounded-xl w-[300px] md:w-[484px] before:content-[{{}}]"
          ></input>
        </form>
        <SearchResults
          foundUsers={foundUsers}
          isLoading={isLoading}
          onProfileClick={onProfileClick}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}

export default Header;
