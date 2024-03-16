import chieldIcon from "../assets/icons/Chield.svg";
import nestingIcon from "../assets/icons/Nesting.svg";
import starIcon from "../assets/icons/Star.svg";
import { formatDistanceToNow } from "date-fns";
import Skeleton from "react-loading-skeleton";

function Card({ repo, isLoading }) {
  const license = repo.license && (
    <div className="flex gap-2 text-slate-200">
      <img src={chieldIcon} />
      {repo.license.spdx_id}
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
        {isLoading ? <Skeleton width={70} height={24} /> : repo.name}
      </a>

      {isLoading ? (
        <Skeleton count={1} height={54} />
      ) : (
        <>
          <p className="pb-5 text-slate-200">{repo.description}</p>

          <div className="flex flex-row gap-4 items-center ">
            {license}
            <div className="flex gap-2 text-slate-200">
              <img src={nestingIcon} />
              {repo.forks}
            </div>
            <div className="flex gap-2 text-slate-200">
              <img src={starIcon} />
              {repo.stargazers_count}
            </div>
            <time className="text-xs text-slate-200">
              updated {updatedTimeAgo}
            </time>
          </div>
        </>
      )}
    </div>
  );
}

export default Card;
