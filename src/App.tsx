import React, { useState } from "react";
import { useQuery } from "react-query";

import "./styles/main.css";
import ProductHunt from "./components/ProductHunt";
import HackerNews from "./components/HackerNews";
import DevTo from "./components/DevTo";
import RecordSelect from "./components/RecordSelect";
import { AirTableData, Record } from "./types";

const App = () => {
  const [record, setRecord] = useState<Record | null>(null);

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

        {data && data.records.length && (
          <>
            <div className="mb-4">
              <RecordSelect
                records={data.records}
                record={record}
                setRecord={setRecord}
              />
            </div>

            <div className="grid gap-12">
              <ProductHunt
                data={
                  record
                    ? record.fields.product_hunt_data
                    : data.records[data.records.length - 1].fields
                        .product_hunt_data
                }
              />
              <HackerNews
                data={
                  record
                    ? record.fields.hn_data
                    : data.records[data.records.length - 1].fields.hn_data
                }
              />
              <DevTo
                data={
                  record
                    ? record.fields.dev_to_data
                    : data.records[data.records.length - 1].fields.dev_to_data
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
