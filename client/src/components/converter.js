import React, { useEffect, useState } from "react";
import { getDataWithPost } from "./api";
import { message, Collapse, Tooltip } from "antd";

import _ from "lodash";
import ReactJson from "react-json-view";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import * as types from "@babel/types";
import traverse from "@babel/traverse";

const acorn = require("acorn");

const Converter = (props) => {
  const { Panel } = Collapse;
  const [data, setData] = useState({});
  const [funcList, setFuncList] = useState([]);
  const fetch = () => {
    getDataWithPost("/data", { path: "/home/divyeshbhalani/todo-service" })
      .then((data) => {
        let fun = [];
        traverse(data.data.ast, {
          enter(path) {
            if (types.isCallExpression(path.node)) {
              if (
                path.node.callee.name &&
                path.node.callee.name !== "require"
              ) {
                fun.push(path.node.callee.name);
                // console.log("🚀 ~ file: converter.js ~ line 29 ~ enter ~ path.node.callee.name", path.node.callee.name)
              }
            }
          },
        });
        if(_.size(fun)>0){
          console.log("🚀 ~ file: converter.js ~ line 35 ~ .then ~ fun", fun)
          setFuncList(fun)
        }
        setData(data.data);
      })
      .catch((error) => {
        console.log("🚀 ~ file: converter.js ~ line 33 ~ fetch ~ error", error);
        message.error("Something went wrong");
      });
  };
  useEffect(() => {
    fetch();
  }, []);
  const handleFunctionClick = (clickedPart, fileName, basePath) => {
    getDataWithPost("/getInfo", { clickedPart, fileName, basePath })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      {
        _.size(funcList) > 0 &&
          _.map(funcList, (f) => {
            // <Tooltip
            //   title={_.map(t.leadingComments, (comment) => {
            //     return <p>{comment.value}</p>;
            //   })}
            // >
             return <p
                style={{ width: "30%" }}
                // onClick={() =>
                //   handleFunctionClick(t, data.fileName, data.basePath)
                // }
              >
                <a>{f}</a>
              </p>
            // </Tooltip>;
          })

        // _.map(data.ast.program.body, (t, i) => {
        //   return _.map(t.declarations, (d, j) => {
        //     if (
        //       d.init.type === "CallExpression" &&
        //       d.init.callee.name !== "require"
        //     ) {
        //       return (
        //         <Tooltip
        //           title={_.map(t.leadingComments, (comment) => {
        //             return <p>{comment.value}</p>;
        //           })}
        //         >
        //           <p
        //             style={{ width: "30%" }}
        //             onClick={() =>
        //               handleFunctionClick(t, data.fileName, data.basePath)
        //             }
        //           >
        //             <a>{data.code.substring(d.init.start, d.init.end)}</a>
        //           </p>
        //         </Tooltip>
        //       );
        //     }
        //   });
        // })
      }
      {/* {data.ast &&
        _.map(data.ast.program.body, (t, i) => {
          if (t.expression && t.expression.type === "CallExpression") {
            return (
              <Tooltip
                title={_.map(t.leadingComments, (comment) => {
                  return <p>{comment.value}</p>;
                })}
              >
                <p
                  onClick={() =>
                    handleFunctionClick(t, data.fileName, data.basePath)
                  }
                >
                  {" "}
                  <a>{data.code.substring(t.start, t.end)}</a>
                </p>
              </Tooltip>
            );
          }
        })} */}
    </div>
  );
};

export default Converter;
