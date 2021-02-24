import React, { useEffect, useState } from "react";
import { getDataWithPost } from "./api";
import { message, Collapse, Tooltip, Switch } from "antd";
import * as js2flowchart from "js2flowchart";
import _ from "lodash";
import ReactJson from "react-json-view";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import * as types from "@babel/types";
import traverse from "@babel/traverse";
import ProjectPathForm from "./ProjectPathForm";

const acorn = require("acorn");

const Converter = (props) => {
  const { Panel } = Collapse;
  const [data, setData] = useState({});
  const [funcList, setFuncList] = useState([]);
  const [codeSwitch, setHandleCodeSwitch] = useState(false);
  const fetch = () => {
    getDataWithPost("/data", { path: "D:/node/note" })
      .then((data) => {
        let fun = [];
        traverse(data.data.ast, {
          enter(path) {
            if (types.isCallExpression(path.node)) {
              console.log(path.node.arguments);
              if (
                path.node.callee.name &&
                path.node.callee.name !== "require"
              ) {
                fun.push(path.node.callee.name);
                path.node.arguments.map((d) => console.log(d.name));

                // console.log("🚀 ~ file: converter.js ~ line 29 ~ enter ~ path.node.callee.name", path.node.callee.name)
              }
            }
          },
        });
        if (_.size(fun) > 0) {
          console.log("🚀 ~ file: converter.js ~ line 35 ~ .then ~ fun", fun);
          setFuncList(fun);
        }

        data.data.svg = js2flowchart.convertCodeToSvg(data.data.code);
        setData(data.data);
        console.log(data.data);
      })
      .catch((error) => {
        console.log("🚀 ~ file: converter.js ~ line 33 ~ fetch ~ error", error);
        message.error("Something went wrong");
      });
  };
  console.log("data.svg", data.svg);
  useEffect(() => {
    // fetch();
  }, []);
  const handleFunctionClick = (clickedPart, fileName, basePath) => {
    getDataWithPost("/getInfo", { clickedPart, fileName, basePath })
      .then((data) => {
        if (data.data.flag) {
          let fun = [];
          traverse(data.data.ast, {
            enter(path) {
              if (types.isCallExpression(path.node)) {
                console.log(path.node.arguments);
                if (
                  path.node.callee.name &&
                  path.node.callee.name !== "require"
                ) {
                  fun.push(path.node.callee.name);
                  path.node.arguments.map((d) => console.log(d.name));
                  // console.log("🚀 ~ file: converter.js ~ line 29 ~ enter ~ path.node.callee.name", path.node.callee.name)
                }
              }
            },
          });
          setFuncList(fun);
          data.data.svg = js2flowchart.convertCodeToSvg(data.data.code);
          setData(data.data);
          console.log(data.data);
        } else {
          message.info(data.data.message)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCodeSwitchVal = (val) => {
    console.log(val);
    setHandleCodeSwitch(val);
  };
  const handlePath = (val) =>{
  
    getDataWithPost("/data", val)
      .then((data) => {
        let fun = [];
        traverse(data.data.ast, {
          enter(path) {
            if (types.isCallExpression(path.node)) {
              console.log(path.node.arguments);
              if (
                path.node.callee.name &&
                path.node.callee.name !== "require"
              ) {
                fun.push(path.node.callee.name);
                path.node.arguments.map((d) => console.log(d.name));

                // console.log("🚀 ~ file: converter.js ~ line 29 ~ enter ~ path.node.callee.name", path.node.callee.name)
              }
            }
          },
        });
        if (_.size(fun) > 0) {
          console.log("🚀 ~ file: converter.js ~ line 35 ~ .then ~ fun", fun);
          setFuncList(fun);
        }

        data.data.svg = js2flowchart.convertCodeToSvg(data.data.code);
        setData(data.data);
        console.log(data.data);
      })
      .catch((error) => {
        console.log("🚀 ~ file: converter.js ~ line 33 ~ fetch ~ error", error);
        message.error("Something went wrong");
      });

  }
  return (
    <div>
      <div>
      <ProjectPathForm onFinish={handlePath} />
      </div>
      <div className="split lift">
        <p>
          <span>
            <label>Code </label>
            <Switch onChange={handleCodeSwitchVal} />
            <label> Flowchart</label>
          </span>
        </p>
        <p>
          <label>File Name</label>

          {data.fileName}
        </p>
        {codeSwitch ? (
          // <svg>
          <div dangerouslySetInnerHTML={{ __html: data.svg }}></div>
        ) : (
          // </svg>
          <pre>
            <code>{data.code}</code>
          </pre>
        )}
      </div>

      <div className="split right">
        {
          _.size(funcList) > 0 &&
            _.map(funcList, (f) => {
              // <Tooltip
              //   title={_.map(t.leadingComments, (comment) => {
              //     return <p>{comment.value}</p>;
              //   })}
              // >
              return (
                <p
                  style={{ width: "30%" }}
                  onClick={() =>
                    handleFunctionClick(f, data.fileName, data.basePath)
                  }
                >
                  <a>{f}</a>
                </p>
              );
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
    </div>
  );
};

export default Converter;
