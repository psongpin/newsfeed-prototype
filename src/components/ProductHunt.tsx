import React from "react";
import { ProductHuntPosts } from "../types";

type Props = {
  data: string;
};

const ProductHunt: React.FC<Props> = ({ data }) => {
  const productHuntData: ProductHuntPosts = JSON.parse(data);
  return (
    <div>
      <h2 className="font-bold text-3xl mb-4">Product Hunt</h2>
      <div className="grid gap-4 grid-cols-2">
        {productHuntData.data.posts.edges.map((post) => {
          const {
            id,
            name,
            thumbnail,
            url,
            tagline,
            votesCount,
            commentsCount,
          } = post.node;

          return (
            <div key={id} className="shadow-md rounded bg-white p-4 flex">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img src={thumbnail.url} alt={name} className="rounded-full" />
              </a>
              <div className="ml-6">
                <h3 className="font-bold text-xl mb-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <span>{name}</span>

                    <span className="text-sm ml-4 inline-block py-1 px-2 border border-black rounded">
                      &#9650; {votesCount}
                    </span>
                  </a>
                </h3>

                <p className="mb-2">{tagline}</p>
                <p className="text-sm font-medium text-gray-600">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {commentsCount > 1
                      ? `${commentsCount} Comments`
                      : `${commentsCount} Comment`}
                  </a>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductHunt;
