import { NowRequest, NowResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async (req: NowRequest, res: NowResponse) => {
  // Product Hunt
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

  let ph_data = null;

  try {
    const ph_response = await fetch(
      "https://api.producthunt.com/v2/api/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_PRODUCT_HUNT_DEV_TOKEN}`,
        },
        body: JSON.stringify({ query, variables: { first: 6 } }),
      }
    );

    ph_data = await ph_response.json();
  } catch (error) {
    throw new Error(error);
  }

  // Dev.to
  let dev_to_data = null;

  try {
    const endpoint = "https://dev.to/api/articles?per_page=6";
    const res = await fetch(endpoint);
    dev_to_data = await res.json();
  } catch (error) {
    throw new Error(error);
  }

  res.json({
    product_hunt_data: JSON.stringify(ph_data),
    dev_to_data: JSON.stringify(dev_to_data),
  });
};
