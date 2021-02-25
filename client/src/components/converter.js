import React, { useEffect, useState } from "react";
import { getDataWithPost } from "./api";
import { message, Collapse, Tooltip, Switch } from "antd";
import * as js2flowchart from "js2flowchart";
import _ from "lodash";
import ReactJson from "react-json-view";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
import ProjectPathForm from "./ProjectPathForm";
import SelectType from "./SelectType";
import { TYPES } from "./constants/Types";
const { trav } = require("./traverse");
const acorn = require("acorn");

const Converter = (props) => {
  const { Panel } = Collapse;
  const [data, setData] = useState({});
  const [funcList, setFuncList] = useState([]);
  const [codeSwitch, setHandleCodeSwitch] = useState(false);
  const [defaultType, setDefaultType] = useState(TYPES.CallExpression);

  const handleFunctionClick = (clickedPart, fileName, basePath) => {
    getDataWithPost("/getInfo", { clickedPart, fileName, basePath })
      .then((data) => {
        if (data.data.code === "ENOENT") {
          message.info("Could not find file or directory");
          return;
        }
        if (data.data.flag) {
          let fun = trav(data.data.ast, defaultType);
          setFuncList(fun);
          data.data.svg = js2flowchart.convertCodeToSvg(data.data.code);
          setData(data.data);
          // console.log(data.data);
        } else {
          message.info(data.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCodeSwitchVal = (val) => {
    setHandleCodeSwitch(val);
  };
  const handleTypeChange = (val) => {
    let fun = trav(data.ast, val);
    setDefaultType(val);
    setFuncList(fun);
  };
  const handlePath = (val) => {
    getDataWithPost("/data", val)
      .then((data) => {
        if (data.data.code === "ENOENT") {
          message.error("Could not find file or directory");
          return;
        }
        let fun = trav(data.data.ast, defaultType);

        if (_.size(fun) > 0) {
          // console.log("🚀 ~ file: converter.js ~ line 35 ~ .then ~ fun", fun);
          setFuncList(fun);
        }

        data.data.svg = js2flowchart.convertCodeToSvg(data.data.code);
        setData(data.data);
        // console.log(data.data);
      })
      .catch((error) => {
        console.log("🚀 ~ file: converter.js ~ line 33 ~ fetch ~ error", error);
        message.error("Something went wrong");
      });
  };
  return (
    <div>
      <div>
        <ProjectPathForm onFinish={handlePath} />
        {/* <FileStructViewer nodesTree={data} /> */}
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
        <SelectType handleChange={handleTypeChange} />
        {
          _.size(funcList) > 0 &&
            _.map(funcList, (f) => {
              return (
                <Tooltip
                  title={_.map(f.leadingComments, (comment) => {
                    return <p>{comment.value}</p>;
                  })}
                >
                  <p
                    style={{ width: "30%" }}
                    onClick={() =>
                      handleFunctionClick(f.name, data.fileName, data.basePath)
                    }
                  >
                    <a>{f.name}</a>
                  </p>
                </Tooltip>
              );
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
