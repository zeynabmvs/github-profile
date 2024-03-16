import { useEffect, useState } from "react";
import { ENV, CLIENT_ID, CLIENT_SECRET } from "../constants";
import { user_repos } from "../data";
import Card from "./Card";

function Repos({ username }) {
  const [userRepos, setUserRepos] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an asynchronous function to fetch data
    async function fetchData() {
      // Check if running on localhost
      if (ENV === "local") {
        setUserRepos(user_repos); // Load data from local file
        setIsLoading(false);
        return;
      }

      try {
        const headers = new Headers();
        headers.append(
          "Authorization",
          `Basic ${btoa(`${import.meta.env.CLIENT_ID}:${CLIENT_SECRET}`)}`
        );

        const apiRepoData =
          "https://api.github.com/users/" + username + "/repos";

        // Fetch data from the API
        const response = await fetch(apiRepoData, {
          method: "GET",
          headers: headers,
        });

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userRepos) {
    return <div>No data available</div>;
  }

  // return four latest repos
  const repos = userRepos.slice(-4);

  const cards = repos.map((repo, index) => (
    <Card repo={repo} key={index} isLoading={isLoading} />
  ));
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

export default Repos;
