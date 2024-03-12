import { useEffect, useState } from "react";
import { found_users } from "../data.js";
import SearchResults from "./SearchResults.jsx";
import debounce from "lodash/debounce";
import searchIcon from '../assets/Search.svg'
import { ENV } from "../constants.js";

function Header({
  searchQuery,
  onSearchQueryChange,
  onSearchSubmit,
  onProfileClick,
}) {
  const [foundUsers, setFoundUsers] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  // Debounce the fetch function to avoid making too many requests in a short time
  const debouncedFetchData = debounce(fetchData, 500);

  async function fetchData() {
    if (searchQuery) {
      if (ENV === "local") {
        setFoundUsers(found_users.items); // Load data from local file, there is no search in this case
        setIsLoading(false);
        return;
      }

      try {
        const userDataApi =
          "https://api.github.com/search/users?q=" + searchQuery;

        // Fetch data from the API
        const response = await fetch(userDataApi);
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
      className="h-[240px] w-full bg-center bg-cover bg-no-repeat bg-[url('/hero-image-github-profile.png')] flex justify-center"
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