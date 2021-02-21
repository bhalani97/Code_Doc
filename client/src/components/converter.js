import React, { useEffect, useState } from "react";
import { getDataWithPost } from "./api";
import { message, Collapse } from "antd";
import _ from "lodash";
import ReactJson from 'react-json-view'
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
const acorn = require("acorn");

const Converter = (props) => {
  const { Panel } = Collapse;
  const [data, setData] = useState({});

  const fetch = () => {
    getDataWithPost("/data", { path: "D:/node/note" })
      .then((data) => {
        setData(data.data);
      })
      .catch((error) => {
        message.error("Something went wrong");
      });
  };
  useEffect(() => {
    fetch();
  }, []);

  return (
    <div>
    {
    data.ast &&
    _.map(data.ast.program.body,(t,i)=>{
    return  _.map(t.declarations, (d, j) => {
        if(d.init.type==="CallExpression" && d.init.name !== "require"){
          return <p> <a>{data.code.substring(d.init.start,d.init.end)}</a></p>
        }
      })
    })     
    }
    </div>
  );
};

export default Converter;
