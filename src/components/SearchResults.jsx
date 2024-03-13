import Skeleton from "react-loading-skeleton";

function SearchResults({ foundUsers, isLoading, onProfileClick, searchQuery }) {
  let foundUsersHtml = null;
  let searchResult = null;

  const handleProfileClick = (e, username) => {
    e.preventDefault(); // Prevent default link behavior
    onProfileClick(username); // Call the onProfileClick callback with the username
  };

  if (foundUsers && searchQuery) {
    searchResult = foundUsers.slice(-5).map((foundUser, index) => (
      <li key={index} className="flex pb-2 gap-2">
        {isLoading ? (
          <Skeleton circle width={72} height={72} />
        ) : (
          <a
            href="#"
            target="_blank"
            onClick={(e) => handleProfileClick(e, foundUser.login)}
          >
            {" "}
            <img
              src={foundUser.avatar_url}
              className="w-[72px] h-[72px] rounded-xl"
            />
          </a>
        )}

        <div className="flex items-center">
          <a
            href="#"
            target="_blank"
            className="textslate-100"
            onClick={(e) => handleProfileClick(e, foundUser.login)}
          >
            {isLoading ? <Skeleton width={80} /> : foundUser.login}
          </a>
          <p className="text-slate-200">{foundUser.bio}</p>
        </div>
      </li>
    ));

    foundUsersHtml = (
      <div className="items bg-darkgray p-2 rounded-xl absolute z-[100] w-[300px] md:w-[484px]">
        <ul className="min-w-10">{searchResult}</ul>
      </div>
    );
  }

  return foundUsersHtml;
}

export default SearchResults;
