import { NowRequest, NowResponse } from "@vercel/node";
import fetch from "node-fetch";
import moment from "moment";

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
    const dev_to_response = await fetch(endpoint);
    dev_to_data = await dev_to_response.json();
  } catch (error) {
    throw new Error(error);
  }

  // HackerNews
  let hn_data = null;

  try {
    const baseEndpointUrl = "https://hacker-news.firebaseio.com/v0/";
    const best_stories_endpoint = `${baseEndpointUrl}beststories.json`;
    let best_stories_response = await fetch(best_stories_endpoint);
    const dataIdsOfNewStories: number[] = await best_stories_response.json();
    const firstSixIdsFromData = dataIdsOfNewStories.slice(0, 6);

    hn_data = await Promise.all(
      firstSixIdsFromData.map(async (id) => {
        const story_endpoint = `${baseEndpointUrl}item/${id}.json`;
        const story_response = await fetch(story_endpoint);
        const dataFromRes = await story_response.json();

        return JSON.stringify(dataFromRes);
      })
    );
  } catch (error) {
    throw new Error(error);
  }

  const externalData = {
    id: moment.utc().toString(),
    date: moment.utc().toString(),
    product_hunt_data: JSON.stringify(ph_data),
    dev_to_data: JSON.stringify(dev_to_data),
    hn_data: JSON.stringify(hn_data),
  };

  try {
    const airtableEndpoint =
      "https://api.airtable.com/v0/appchq5hwjYpEo3ep/External%20Data";

    const response = await fetch(airtableEndpoint, {
      body: JSON.stringify({
        records: [
          {
            fields: externalData,
          },
        ],
      }),
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    throw new Error(error);
  }

  res.json(externalData);
};
