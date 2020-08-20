import React from "react";
import { useQuery } from "react-query";

type HNPostData = {
  url?: string;
  title: string;
  score: number;
  kids?: number[];
};

const baseEndpointUrl = "https://hacker-news.firebaseio.com/v0/";

const HNPost: React.FC<{ id: number }> = ({ id }) => {
  const endpoint = `${baseEndpointUrl}item/${id}.json`;

  const { isLoading, error, data } = useQuery(endpoint, async () => {
    const res = await fetch(endpoint);
    const dataFromRes: HNPostData = await res.json();
    return dataFromRes;
  });

  if (isLoading) return <p>loading...</p>;

  if (error) return <p>{"An error has occurred: " + error.message}</p>;

  const url =
    data && data.url ? data.url : `https://news.ycombinator.com/item?id=${id}`;

  return data ? (
    <div className="shadow-md rounded bg-white p-4">
      <h3 className="font-bold text-lg mb-2">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {data.title}
        </a>
      </h3>

      <p className="text-sm mb-1">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600"
        >
          {new URL(url).origin}
        </a>
      </p>

      <p className="text-sm">
        <span className="mr-2">&#9650; {data.score}</span>
        <span>
          {data.kids
            ? `${data.kids.length} Comment${data.kids.length > 1 ? "s" : ""}`
            : "0 Comment"}
        </span>
      </p>
    </div>
  ) : null;
};

const HackerNews: React.FC = () => {
  const endpoint = `${baseEndpointUrl}beststories.json`;

  const { isLoading, error, data } = useQuery(endpoint, async () => {
    const res = await fetch(endpoint);
    const dataIdsOfNewStories: number[] = await res.json();
    const firstSixIdsFromData = dataIdsOfNewStories.slice(0, 6);
    return firstSixIdsFromData;
  });

  return (
    <div>
      <h2 className="font-bold text-3xl mb-4">Hacker News</h2>

      <div>
        {isLoading && <p>loading...</p>}

        {error && <p>{"An error has occurred: " + error.message}</p>}

        {data && (
          <div className="grid gap-4 grid-cols-2">
            {data.map((id) => (
              <HNPost key={id} id={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HackerNews;
