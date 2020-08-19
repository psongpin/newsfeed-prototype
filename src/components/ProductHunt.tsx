import React from "react";
import { useQuery } from "react-query";

type ProductHuntPosts = {
  data: {
    posts: {
      edges: {
        node: {
          id: string;
          name: string;
          tagline: string;
          thumbnail: {
            url: string;
          };
          url: string;
          votesCount: number;
          commentsCount: number;
        };
      }[];
    };
  };
};

const query = `
  query getPosts($first: Int) {
    posts(first: $first) {
      edges {
        node {
          id
          name
          tagline
          thumbnail {
            url(width: 100)
          }
          url
          votesCount
          commentsCount
        }
      }
    }
  }
`;

const ProductHunt: React.FC = () => {
  const { isLoading, error, data } = useQuery(query, async () => {
    const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_PRODUCT_HUNT_DEV_TOKEN}`,
      },
      body: JSON.stringify({ query, variables: { first: 6 } }),
    });

    const queryData: ProductHuntPosts = await res.json();
    return queryData;
  });

  return (
    <div>
      <h2 className="font-bold text-3xl mb-4">Product Hunt</h2>
      <div>
        {isLoading && <p>loading...</p>}

        {error && <p>{"An error has occurred: " + error.message}</p>}

        {data && (
          <div className="grid gap-4 grid-cols-2">
            {data.data.posts.edges.map((post) => {
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
                    <img
                      src={thumbnail.url}
                      alt={name}
                      className="rounded-full"
                    />
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
        )}
      </div>
    </div>
  );
};

export default ProductHunt;
