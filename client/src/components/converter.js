import React, { useEffect, useState } from "react";
import { getDataWithPost } from "./api";
import { message, Collapse } from "antd";
import _ from "lodash";
import ReactJson from 'react-json-view'
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
const acorn = require("acorn");
const fs = require("fs-react");

const Converter = (props) => {
  const { Panel } = Collapse;
  const [data, setData] = useState([]);
  const [path, setPath] = useState([]);

  const fetch = () => {
    getDataWithPost("/data", { path: "/home/divyeshbhalani/note-service" })
      .then((data) => {
        let tempDict = [];
        // _.forEach(data.data.data.body, (d, i) => {
        //   let dict = {};
        //   if (d.type === "ExpressionStatement") {
        //     if (d.expression.type) {
        //       if (d.expression.callee) {
        //         if (d.expression.callee.type === "MemberExpression") {
        //           if (d.expression.callee.object.name === "app") {
        //             _.map(d.expression.arguments, (arg) => {
        //               if (arg.type === "Literal") {
        //                 dict.path = arg.value;
        //               }
        //               if (arg.type === "Identifier") {
        //                 dict.methodName = arg.name;
        //               }
        //             });
        //           }
        //         }
        //       }
        //     }
        //   }
        //   if (dict.path && dict.methodName) {
        //     console.log(dict);
        //     tempDict.push(dict);
        //   }
        // });
        setPath(tempDict);
        setData(data.data.data);
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
      <ReactJson src={data} />

      <Collapse defaultActiveKey={["0"]} >
        {_.map(path, (p, i) => {
          return (
            <Panel header={<p>Path : {p.path} Method Name : {p.methodName}</p>} key={i}>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default Converter;
