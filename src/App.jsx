import { useEffect, useState } from "react";
import "./App.css";
import { user_data, found_users, user_repos } from "./data.js";
import { formatDistanceToNow } from "date-fns";
import debounce from "lodash/debounce";

const env = "local";

function Card({ repo }) {
  const license = repo.license && (
    <div className="flex gap-2 text-slate-200">
      <ChieldIcon /> {repo.license.spdx_id}
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
          <NestingIcon />
          {repo.forks}
        </div>
        <div className="flex gap-2 text-slate-200">
          <StarIcon />
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
    return (
      <div className="flex justify-center p-12">
        <LoadingIcon />
      </div>
    );
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
      searchResult = <p>Loading, please wait</p>;
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
            <SearchIcon />
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

function NestingIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="18"
        y="15"
        width="4"
        height="4"
        rx="2"
        transform="rotate(90 18 15)"
        stroke="#97A3B6"
        strokeWidth="2"
      />
      <rect
        x="6"
        y="8"
        width="4"
        height="4"
        rx="2"
        transform="rotate(-90 6 8)"
        stroke="#97A3B6"
        strokeWidth="2"
      />
      <path
        d="M8 8V13C8 14.8856 8 15.8284 8.58579 16.4142C9.17157 17 10.1144 17 12 17H14"
        stroke="#97A3B6"
        strokeWidth="2"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11" cy="11" r="7" stroke="#4A5567" strokeWidth="2" />
      <path
        d="M20 20L17 17"
        stroke="#4A5567"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChieldIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.8 16.4L15 17.75C13.2222 19.0833 10.7778 19.0833 9 17.75L7.2 16.4C5.18555 14.8892 4 12.5181 4 10V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V10C20 12.5181 18.8144 14.8892 16.8 16.4Z"
        stroke="#97A3B6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="10" r="1" fill="#97A3B6" />
      <circle cx="9" cy="10" r="1" fill="#97A3B6" />
      <circle cx="15" cy="10" r="1" fill="#97A3B6" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.1437 6.62758C10.9303 4.66658 11.3236 3.68608 12 3.68608C12.6763 3.68608 13.0696 4.66658 13.8562 6.62758L13.8928 6.7189C14.3372 7.82676 14.5594 8.3807 15.0123 8.71739C15.4651 9.05407 16.0596 9.10731 17.2485 9.21379L17.4634 9.23304C19.4092 9.4073 20.3822 9.49443 20.5903 10.1134C20.7985 10.7324 20.076 11.3897 18.6309 12.7044L18.1487 13.1432C17.4172 13.8087 17.0514 14.1415 16.8809 14.5776C16.8491 14.659 16.8227 14.7423 16.8018 14.8271C16.6897 15.2818 16.7968 15.7645 17.0111 16.73L17.0777 17.0305C17.4714 18.8048 17.6682 19.692 17.3246 20.0747C17.1961 20.2177 17.0292 20.3206 16.8438 20.3712C16.3476 20.5066 15.6431 19.9326 14.2342 18.7845C13.309 18.0306 12.8464 17.6537 12.3153 17.5689C12.1064 17.5355 11.8935 17.5355 11.6846 17.5689C11.1535 17.6537 10.6909 18.0306 9.76577 18.7845C8.35681 19.9326 7.65234 20.5066 7.15614 20.3712C6.97072 20.3206 6.80381 20.2177 6.67538 20.0747C6.33171 19.692 6.52854 18.8048 6.92222 17.0305L6.98889 16.73C7.2031 15.7645 7.31021 15.2818 7.19815 14.8271C7.17725 14.7423 7.15081 14.659 7.11901 14.5776C6.94854 14.1415 6.58279 13.8087 5.85128 13.1432L5.369 12.7044C3.92395 11.3897 3.20143 10.7324 3.40961 10.1134C3.61779 9.49443 4.5907 9.4073 6.53651 9.23304L6.75145 9.21379C7.94036 9.10731 8.53482 9.05407 8.98767 8.71739C9.44052 8.3807 9.66272 7.82676 10.1071 6.71889L10.1437 6.62758Z"
        stroke="#97A3B6"
        strokeWidth="2"
      />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <div role="status">
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
