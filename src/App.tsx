import React from "react";
import { useQuery } from "react-query";

import "./styles/main.css";
import ProductHunt from "./components/ProductHunt";
import HackerNews from "./components/HackerNews";
import DevTo from "./components/DevTo";

type AirTableData = {
  records: {
    id: string;
    createdTime: string;
    fields: {
      id: string;
      date: string;
      product_hunt_data: string;
      dev_to_data: string;
      hn_data: string;
    };
  }[];
};

const App = () => {
  const endpoint =
    "https://api.airtable.com/v0/appchq5hwjYpEo3ep/External%20Data?view=Grid%20view";

  const { isLoading, error, data } = useQuery(endpoint, async () => {
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}`,
      },
    });
    const dataFromRes: AirTableData = await res.json();
    return dataFromRes;
  });

  return (
    <div className="app min-h-screen bg-gray-100">
      <div className="container py-24">
        {isLoading && <p>loading...</p>}

        {error && <p>{"An error has occurred: " + error.message}</p>}

        {data && (
          <div className="grid gap-12">
            <ProductHunt data={data.records[1].fields.product_hunt_data} />
            <HackerNews data={data.records[1].fields.hn_data} />
            <DevTo data={data.records[1].fields.dev_to_data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
