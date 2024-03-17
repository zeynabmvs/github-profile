import { useEffect, useState } from "react";
import { CLIENT_ID, CLIENT_SECRET } from "../constants";
import Card from "./Card";

function Repos({ username }) {
  const [userRepos, setUserRepos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an asynchronous function to fetch data
    async function fetchData() {
      try {
        setIsLoading(true);

        const headers = new Headers();
        headers.append(
          "Authorization",
          `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
        );

        const url = `https://api.github.com/users/${username}/repos`;

        console.log("api call:", url);

        // Fetch data from the API
        const response = await fetch(url, {
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

  return (
    <div className="flex flex-col">
      {error && <p>Error: {error.message}</p>}
      {userRepos && (
        <div className="cards flex flex-col lg:grid grid-cols-2 gap-8 mb-12">
          {userRepos.slice(-4).map((repo, index) => (
            <Card repo={repo} key={index} isLoading={isLoading} />
          ))}
        </div>
      )}

      <a
        href={`https://github.com/${username}`}
        className="text-base text-slate-200 text-center mb-20 hover:underline"
        target="_blank"
      >
        View all repositories
      </a>
    </div>
  );
}

export default Repos;
