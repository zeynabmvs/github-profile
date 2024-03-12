import { useEffect, useState } from "react";
import "./App.css";
import { user_data, found_users, user_repos } from "./data.js";
import { formatDistanceToNow } from "date-fns";
import debounce from "lodash/debounce";
import chieldIcon from "./assets/Chield.svg";
import nestingIcon from "./assets/Nesting.svg";
import searchIcon from "./assets/Search.svg";
import starIcon from "./assets/Star.svg";

const env = "local";

function Card({ repo }) {
  const license = repo.license && (
    <div className="flex gap-2 text-slate-200">
      <img src={chieldIcon} />
      {repo.license.spdx_id}
    </div>
  );

  const updatedTimeAgo = formatDistanceToNow(new Date(repo.updated_at), {
    addSuffix: true,
  });

  return (
    <div className="card">
      <a
        href={repo.html_url}
        className="text-xl pb- text-slate-100 hover:underline font-semibold"
        target="_blank"
      >
        {repo.name}
      </a>
      <p className="pb-5 text-slate-200">{repo.description}</p>

      <div className="flex flex-row gap-4 items-center ">
        {license}
        <div className="flex gap-2 text-slate-200">
          <img src={nestingIcon} />
          {repo.forks}
        </div>
        <div className="flex gap-2 text-slate-200">
          <img src={starIcon} />
          {repo.stargazers_count}
        </div>
        <time className="text-xs text-slate-200">updated {updatedTimeAgo}</time>
      </div>
    </div>
  );
}

function Repos({ username }) {
  const [userRepos, setUserRepos] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an asynchronous function to fetch data
    async function fetchData() {
      // Check if running on localhost
      if (env === "local") {
        setUserRepos(user_repos); // Load data from local file
        setIsLoading(false);
        return;
      }

      try {
        const apiRepoData =
          "https://api.github.com/users/" + username + "/repos";

        // Fetch data from the API
        const response = await fetch(apiRepoData);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        // Parse the JSON response
        const jsonData = await response.json();

        // Update the state with the fetched data
        setUserRepos(jsonData);
        setIsLoading(false);
      } catch (error) {
        // Handle errors
        setError(error.message);
        setIsLoading(false);
      }
    }

    // Call the fetchData function
    fetchData();
  }, [username]); // Empty dependency array means this effect runs once after the initial render

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userRepos) {
    return <div>No data available</div>;
  }

  // return four latest repos
  const repos = userRepos.slice(-4);

  const cards = repos.map((repo, index) => <Card repo={repo} key={index} />);
  const user_repos_url = "https://github.com/" + username;

  return (
    <div className="flex flex-col">
      <div className="cards flex flex-col lg:grid grid-cols-2 gap-8 mb-12">
        {cards}
      </div>
      <a
        href={user_repos_url}
        className="text-base text-slate-200 text-center mb-20 hover:underline"
        target="_blank"
      >
        View all repositories
      </a>
    </div>
  );
}

function Profile({ username }) {
  // Toggle between these lines to use local data or API
  const [userData, setUserData] = useState();
  const defaultAvatarUrl = "../public/avatar-default.svg";

  useEffect(() => {
    async function fetchData() {
      // Check if running on localhost
      if (env === "local") {
        setUserData(user_data); // Load data from local file
        return;
      }

      try {
        const userDataApi = "https://api.github.com/users/" + username;

        // Fetch data from the API
        const response = await fetch(userDataApi);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        // Parse the json response
        const jsonData = await response.json();

        // Update the state with fetched data
        setUserData(jsonData);
      } catch (error) {}
    }

    // Call the fetch data function
    fetchData();
  }, [username]); // Empty dependency array means this effect runs once after the initial render

  if (!userData) {
    return <div className="text-center p-8">No data available</div>;
  }

  return (
    <div className="profile lg:-mt-11 pb-9">
      <div className="flex lg:items-end gap-6 xl:gap-12 pb-9 lg:pb-5">
        <div className="bg-gray p-2 rounded-2xl -mt-11 lg:mt-0">
          <img
            src={userData.avatar_url ? userData.avatar_url : defaultAvatarUrl}
            alt={userData.name}
            className="rounded-xl w-[104px] h-[104px]"
          />
        </div>
        <div className="flex pt-3 lg:pb-3 lg:pt-0 gap-5 flex-col lg:flex-row items-start lg:items-center">
          <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-5 lg:px-9 flex items-center justify-start">
            Followers
            <span className="block h-9 w-px mx-5 lg:mx-9 bg-slate-200"></span>
            <span className="text-slate-100">
              {userData.followers != null ? userData.followers : "-"}
            </span>
          </div>
          <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-5 lg:px-9 flex items-center justify-start">
            Following
            <span className="block h-9 w-px mx-5 lg:mx-9 bg-slate-200"></span>
            <span className="text-slate-100">
              {userData.following != null ? userData.following : "-"}
            </span>
          </div>
          <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-5 lg:px-9 flex items-center justify-start">
            Location
            <span className="block h-9 w-px mx-5 lg:mx-9 bg-slate-200"></span>
            <span className="text-slate-100">
              {userData.location ? userData.location : "-"}
            </span>
          </div>
        </div>
      </div>
      <h2 className="capitalize text-2base pb-2 text-slate-100 font-semibold">
        {userData.login ? userData.login : "-"}
      </h2>
      <p className="text-slate-200 font-normal	">
        {userData.bio ? userData.bio : "-"}
      </p>
    </div>
  );
}

function SearchResults({ foundUsers, isLoading, onProfileClick }) {
  let foundUsersHtml = null;
  let searchResult = null;

  const handleProfileClick = (e, username) => {
    e.preventDefault(); // Prevent default link behavior
    onProfileClick(username); // Call the onProfileClick callback with the username
  };

  if (foundUsers) {
    if (isLoading) {
      searchResult = <LoadingComponent />;
    } else {
      searchResult = foundUsers.slice(-5).map((foundUser, index) => (
        <li key={index} className="flex pb-2 gap-2">
          <a
            href="#"
            target="_blank"
            onClick={(e) => handleProfileClick(e, foundUser.login)}
          >
            <img
              src={foundUser.avatar_url}
              className="w-[72px] h-[72px] rounded-xl"
            />
          </a>
          <div className="flex items-center">
            <a
              href="#"
              target="_blank"
              className="textslate-100"
              onClick={(e) => handleProfileClick(e, foundUser.login)}
            >
              {foundUser.login}
            </a>
            <p className="text-slate-200">{foundUser.bio}</p>
          </div>
        </li>
      ));
    }

    foundUsersHtml = (
      <div className="items bg-darkgray p-2 rounded-xl absolute z-100 w-[300px] md:w-[484px]">
        <ul className="min-w-10">{searchResult}</ul>
      </div>
    );
  }

  return foundUsersHtml;
}

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
      if (env === "local") {
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
        />
      </div>
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("github");

  const handleSearchSubmit = () => {
    console.log("search submitted", searchQuery);
  };

  console.log(searchQuery);

  const handleProfileClick = (newUsername) => {
    console.log("profile clicked", newUsername);
    setUsername(newUsername); // Update the username state with the new username
  };

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onProfileClick={handleProfileClick}
      />
      <div className="container px-4">
        <Profile username={username} />
        <Repos username={username} />
      </div>
    </>
  );
}

export default App;

function LoadingComponent() {
  return (
    <div className="flex justify-center p-12" role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 animate-spin fill-slate-400"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
