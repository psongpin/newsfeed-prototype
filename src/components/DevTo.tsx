import React from "react";
import { DevToData } from "../types";

type Props = {
  data: string;
};

const DevTo: React.FC<Props> = ({ data }) => {
  const devToData: DevToData = JSON.parse(data);
  return (
    <div>
      <h2 className="font-bold text-3xl mb-4">Dev.to</h2>

      {data && (
        <div className="grid gap-4 grid-cols-2">
          {devToData.map(
            ({ title, url, positive_reactions_count, tag_list }) => (
              <div key={url} className="shadow-md rounded bg-white p-4">
                <h3 className="font-bold text-lg mb-2">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {title}
                  </a>
                </h3>

                <p className="text-sm">
                  <span className="mr-4">
                    &#9829; {positive_reactions_count}
                  </span>
                  {tag_list.map((tag) => (
                    <span key={tag} className="mr-2">{`#${tag}`}</span>
                  ))}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DevTo;
