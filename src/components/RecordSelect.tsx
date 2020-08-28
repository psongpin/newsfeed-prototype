import React, { useState } from "react";
import moment from "moment";
import { Record } from "../types";
import _keyBy from "lodash/keyBy";

type Props = {
  records: Record[];
  record: Record | null;
  setRecord: React.Dispatch<React.SetStateAction<Record | null>>;
};

const RecordSelect: React.FC<Props> = ({ records, record, setRecord }) => {
  const [recordId, setRecordId] = useState("");

  const normalizedRecords = _keyBy(records, "id");

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRecordId(event.currentTarget.value);
    setRecord(normalizedRecords[event.currentTarget.value]);
  };

  return (
    <select value={recordId} onChange={handleSelect}>
      <option value="" disabled>
        Select Date
      </option>
      {records.map((rec) => {
        return (
          <option key={rec.id} value={rec.id}>
            {moment(rec.fields.date).toString()}
          </option>
        );
      })}
    </select>
  );
};

export default RecordSelect;
