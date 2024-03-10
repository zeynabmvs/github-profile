import { useEffect, useState } from "react";
import "./App.css";
import { user_data } from "./data.js";
import { user_repos } from "./data.js";
import { formatDistanceToNow } from "date-fns";

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
        className="text-xl pb- text-slate-100 hover:underline"
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
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        console.log("Running on localhost, loading local data.");
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
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (isLoading) {
    return <div>Loading...</div>;
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

  return (
    <div className="flex flex-col items-center">
      <div className="cards grid grid-cols-2 gap-8 mb-12">{cards}</div>
      <a
        href="#"
        className="text-base text-slate-200 text-center mb-20 hover:underline"
      >
        View all repositories
      </a>
    </div>
  );
}

function Profile({ username }) {
  // Toggle between these lines to use local data or API
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // Check if running on localhost
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        console.log("Running on localhost, loading local data.");
        setUserData(user_data); // Load data from local file
        setIsLoading(false);
        return;
      }

      try {
        const userDataApi = "https://api.github.com/users/" + username;

        // Fetch data from the API
        const response = await fetch(userDataApi);
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        // Parse the json response
        const jsonData = await response.json();

        // Update the state with fetched data
        setUserData(jsonData);
        setIsLoading(false);
      } catch (error) {
        // Handle Errors
        setError(error.message);
        setIsLoading(false);
      }
    }

    // Call the fetch data function
    fetchData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No data available</div>;
  }

  return (
    <div className="profile -mt-11 pb-9">
      <div className="flex items-end gap-12 pb-5">
        <div className="bg-gray p-2 rounded-2xl">
          <img
            src={userData.avatar_url}
            alt={userData.name}
            className="rounded-xl w-[104px] h-[104px]"
          />
        </div>
        <div className="flex pb-3 gap-5">
          <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-9 flex items-center justify-center">
            Followers<span className="block h-9 w-px mx-9 bg-slate-200"></span>
            <span className="text-slate-100">{userData.followers}</span>
          </div>
          <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-9 flex items-center justify-center">
            Following<span className="block h-9 w-px mx-9 bg-slate-200"></span>
            <span className="text-slate-100">{userData.following}</span>
          </div>
          <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-9 flex items-center justify-center">
            Location<span className="block h-9 w-px mx-9 bg-slate-200"></span>
            <span className="text-slate-100">{userData.location}</span>
          </div>
        </div>
      </div>
      <h2 className="capitalize text-2base pb-2 text-slate-100">
        {userData.login}
      </h2>
      <p className="text-slate-200 font-normal	">{userData.bio}</p>
    </div>
  );
}

function Header({ username, onSearchQueryChange, onSearchSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div
      id="header"
      className="h-[240px] w-full bg-center bg-cover bg-no-repeat bg-[url('/hero-image-github-profile.png')] flex justify-center"
    >
      <form onSubmit={handleSubmit} className="relative mt-8 self-start">
        <span className="absolute top-4 left-5">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="bg-gray text-slate-100 placeholder-slate-300 p-4 pl-12 rounded-xl w-[484px] before:content-[{{}}]"
        ></input>
      </form>
    </div>
  );
}

function App() {
  const [seachQuery, setSetSearchQuery] = useState("");
  const handleSearchSubmit = () => {
    console.log("search submitted", seachQuery);
  };
  console.log(seachQuery);

  return (
    <>
      <Header
        username={seachQuery}
        onSearchQueryChange={setSetSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />
      <div className="container">
        <Profile username={seachQuery} />
        <Repos username={seachQuery} />
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
