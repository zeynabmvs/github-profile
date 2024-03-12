import chieldIcon from "../assets/Chield.svg";
import nestingIcon from "../assets/Nesting.svg";
import starIcon from "../assets/Star.svg";
import { formatDistanceToNow } from "date-fns";

function Card({ repo }) {
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
        {repo.name}
      </a>
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
        <time className="text-xs text-slate-200">updated {updatedTimeAgo}</time>
      </div>
    </div>
  );
}

export default Card;
