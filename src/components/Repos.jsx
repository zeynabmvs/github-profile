import Card from "./Card";
import useFetch from "../hooks/useFetch";

function Repos({ username }) {
  const {
    isLoading,
    data: userRepos,
    error,
  } = useFetch(`https://api.github.com/users/${username}/repos`);

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
