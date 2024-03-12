import { useState, useEffect } from "react";
import { user_data } from "../data";
import { ENV } from "../constants.js";

function Profile({ username }) {
  // Toggle between these lines to use local data or API
  const [userData, setUserData] = useState();
  const defaultAvatarUrl = "../public/avatar-default.svg";

  useEffect(() => {
    async function fetchData() {
      // Check if running on localhost
      if (ENV === "local") {
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

export default Profile;
