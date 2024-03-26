import Skeleton from "react-loading-skeleton";
import useFetch from "../hooks/useFetch";

function Profile({ username }) {
  const {
    isLoading,
    data: userData,
    error,
  } = useFetch(`https://api.github.com/users/${username}`);

  return (
    <div className="profile lg:-mt-11 pb-9">
      {error && <p>Error: {error.message}</p>}
      {userData && (
        <>
          <div className="flex flex-col sm:flex-row items-start lg:items-end gap-6 xl:gap-12 pb-9 lg:pb-5">
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
              <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-5 xl:px-9 flex items-center justify-start">
                Followers
                <span className="block h-9 w-px mx-5 lg:mx-9 bg-slate-200"></span>
                <span className="text-slate-100">
                  {isLoading ? "-" : userData.followers}
                </span>
              </div>
              <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-5 xl:px-9 flex items-center justify-start">
                Following
                <span className="block h-9 w-px mx-5 lg:mx-9 bg-slate-200"></span>
                <span className="text-slate-100">
                  {isLoading ? "-" : userData.following}
                </span>
              </div>

              {userData.location && (
                <div className="bg-darkgray rounded-xl text-slate-300 h-[52px] py-2 px-5 xl:px-9 flex items-center justify-start">
                  Location
                  <span className="block h-9 w-px mx-5 lg:mx-9 bg-slate-200"></span>
                  <span className="text-slate-100">
                    {isLoading ? "-" : userData.location}
                  </span>
                </div>
              )}
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
