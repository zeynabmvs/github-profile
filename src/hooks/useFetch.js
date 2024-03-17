import { useState, useEffect } from "react";
import { CLIENT_ID, CLIENT_SECRET } from "../constants";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    setIsLoading(true);
    const headers = new Headers();
    headers.append(
      "Authorization",
      `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
    );

    console.log("api call:", url);

    fetch(url, { method: "GET", headers: headers })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch(setError);
  }, [url]);

  return { isLoading, data, error };
}

export default useFetch;
