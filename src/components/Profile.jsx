import { useState, useEffect } from "react";
import { CLIENT_ID, CLIENT_SECRET } from "../constants";
import Skeleton from "react-loading-skeleton";

function Profile({ username }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    setIsLoading(true);
    const headers = new Headers();
    headers.append(
      "Authorization",
      `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
    );

    const url = `https://api.github.com/users/${username}`;
    console.log("api call:", url);

    fetch(url, { method: "GET", headers: headers })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setIsLoading(false);
      })
      .catch(setError);
  }, [username]);

  return (
    <div className="profile lg:-mt-11 pb-9">
      {error && <p>Error: {error.message}</p>}
      {userData && (
        <>
          <div className="flex lg:items-end gap-6 xl:gap-12 pb-9 lg:pb-5">
            <div className="bg-gray p-2 rounded-2xl -mt-11 lg:mt-0">
              {isLoading ? (
                <Skeleton
                  circle
                  height={104}
                  width={104}
                  containerClassName="avatar-skeleton"
                />
              ) : (
                <img
                  src={userData.avatar_url}
                  alt={userData.name}
                  className="rounded-xl size-[104px]"
                />
              )}
            </div>
            <div className="flex pt-3 lg:pb-3 lg:pt-0 gap-5 flex-col lg:flex-row items-start lg:items-center">
              <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-5 lg:px-9 flex items-center justify-start">
                Followers
                <span className="block h-9 w-px mx-5 lg:mx-9 bg-slate-200"></span>
                <span className="text-slate-100">
                  {isLoading ? "-" : userData.followers}
                </span>
              </div>
              <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-5 lg:px-9 flex items-center justify-start">
                Following
                <span className="block h-9 w-px mx-5 lg:mx-9 bg-slate-200"></span>
                <span className="text-slate-100">
                  {isLoading ? "-" : userData.following}
                </span>
              </div>

              <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-5 lg:px-9 flex items-center justify-start">
                Location
                <span className="block h-9 w-px mx-5 lg:mx-9 bg-slate-200"></span>
                <span className="text-slate-100">
                  {isLoading ? "-" : userData.location}
                </span>
              </div>
            </div>
          </div>
          <h2 className="capitalize text-2base pb-2 text-slate-100 font-semibold">
            {isLoading ? (
              <Skeleton width="70px" variant="h1"></Skeleton>
            ) : (
              userData.login
            )}
          </h2>
          <p className="text-slate-200 font-normal">
            {isLoading ? <Skeleton width="20%"></Skeleton> : userData.bio}
          </p>
        </>
      )}
    </div>
  );
  // }
}

export default Profile;
