import React from "react";
import { useQuery } from "react-query";

type DevToData = {
  title: string;
  url: string;
  positive_reactions_count: number;
  tag_list: string[];
}[];

const DevTo: React.FC = () => {
  const endpoint = "https://dev.to/api/articles?per_page=6";

  const { isLoading, error, data } = useQuery(endpoint, async () => {
    const res = await fetch(endpoint);
    const dataFromRes: DevToData = await res.json();
    return dataFromRes;
  });

  if (isLoading) return <p>loading...</p>;

  if (error) return <p>{"An error has occurred: " + error.message}</p>;

  return (
    <div>
      <h2 className="font-bold text-3xl mb-4">Dev.to</h2>

      {data && (
        <div className="grid gap-4 grid-cols-2">
          {data.map(({ title, url, positive_reactions_count, tag_list }) => (
            <div className="shadow-md rounded bg-white p-4">
              <h3 className="font-bold text-lg mb-2">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {title}
                </a>
              </h3>

              <p className="text-sm">
                <span className="mr-4">&#9829; {positive_reactions_count}</span>
                {tag_list.map((tag) => (
                  <span className="mr-2">{`#${tag}`}</span>
                ))}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DevTo;
