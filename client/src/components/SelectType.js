import React from 'react';
import { Select } from "antd";
import { TYPES } from "./constants/Types";
const _ = require("lodash");
const { Option } = Select;

const SelectType = (props) => {
   
  return (
    <div>
      <Select
      defaultValue={TYPES["CallExpression"]}
        style={{ width: 180 }}
        onChange={props.handleChange}
      >
        {_.map(Object.keys(TYPES), (k) => {
         return <Option value={TYPES[k]}>{k}</Option>;
        })}
      </Select>
    </div>
  );
};

export default SelectType
