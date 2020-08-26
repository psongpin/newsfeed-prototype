import { NowRequest, NowResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async (req: NowRequest, res: NowResponse) => {
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

  const response = await fetch("https://api.producthunt.com/v2/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_PRODUCT_HUNT_DEV_TOKEN}`,
    },
    body: JSON.stringify({ query, variables: { first: 6 } }),
  });

  const data = await response.json();

  res.json({ test: JSON.stringify(data) });
};
