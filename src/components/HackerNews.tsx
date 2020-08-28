import React from "react";
import { HNPostData } from "../types";

const HNPost: React.FC<{ post: HNPostData }> = ({ post }) => {
  const url = post.url
    ? post.url
    : `https://news.ycombinator.com/item?id=${post.id}`;

  return (
    <div className="shadow-md rounded bg-white p-4">
      <h3 className="font-bold text-lg mb-2">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {post.title}
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
        <span className="mr-2">&#9650; {post.score}</span>
        <span>
          {post.kids
            ? `${post.kids.length} Comment${post.kids.length > 1 ? "s" : ""}`
            : "0 Comment"}
        </span>
      </p>
    </div>
  );
};

const HackerNews: React.FC<{ data: string }> = ({ data }) => {
  const hnData: string[] = JSON.parse(data);
  return (
    <div>
      <h2 className="font-bold text-3xl mb-4">Hacker News</h2>
      <div className="grid gap-4 grid-cols-2">
        {hnData.map((storyStringResponse) => {
          const parsedPost = JSON.parse(storyStringResponse);
          return <HNPost key={parsedPost.id} post={parsedPost} />;
        })}
      </div>
    </div>
  );
};

export default HackerNews;
