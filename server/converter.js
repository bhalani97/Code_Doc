const acorn = require("acorn");
const fs = require("fs");
const walk = require("acorn-walk");
const _ = require("lodash");
const path = require("path");
const e = require("cors");

const converter = (req, resp) => {
  try {
    const body = req.body;
    console.log(body);
    let temp = "";
    temp = fs.readFileSync(body.path + "/app.js");
    temp = acorn.parse(temp.toString());
    _.forEach(temp.body, (t, i) => {
      if (t.type === "VariableDeclaration") {
        _.forEach(t.declarations, (d, j) => {
          if (d.init && d.init.callee && d.init.callee.name === "require") {
            _.forEach(d.init.arguments, (v, k) => {
              // console.log("Hi",v.value)
              // let recPath = body.path;
              let filePath = pathMaker(body.path, v.value);
              if (filePath) {
                console.log(
                  "🚀 ~ file: converter.js ~ line 23 ~ _.forEach ~ filePath",
                  filePathMaker(pathMaker(body.path, v.value))
                );
              }
            });
          }
        });
      }
    });
    // walk.simple(temp, {
    // ExpressionStatement(node) {
    // console.log("🚀 ~ file: converter.js ~ line 13 ~ Literal ~ node", node);
    // },
    // });
    return resp.send({ data: temp });
    const data = acorn.parse();
    console.log(data);
    _.forEach(data.body, (d, i) => {
      //   console.log("data",d,i)
      let dict = {};
      if (d.type === "ExpressionStatement") {
        if (d.expression.type) {
          if (d.expression.callee) {
            if (d.expression.callee.type === "MemberExpression") {
              if (d.expression.callee.object.name === "app") {
                _.map(d.expression.arguments, (arg) => {
                  if (arg.type === "Literal") {
                    dict.path = arg.value;
                  }
                  if (arg.type === "Identifier") {
                    dict.methodName = arg.name;
                  }
                });
              }
            }
          }
        }
      }
      if (dict.path && dict.methodName) {
        console.log("dict.path && dict.methodName", dict.path, dict.methodName);
        _.map(data.body, (d) => {
          _.map(d.declarations, (d) => {
            if (d.id && d.id.name === dict.methodName) {
              if (d.init && d.init.arguments) {
                _.map(d.init.arguments, (t) => {
                  const tempData = fs
                    .readFileSync(appPath + t.value.split(".")[1] + "/index.js")
                    .toString();
                  const data = acorn.parse(tempData);
                  fs.writeFileSync("routes.json", JSON.stringify(data));
                });
              }
            }
          });
        });
      }
    });

    // fs.writeFileSync("parsed.json",JSON.stringify(acorn.parse(data)))
  } catch (error) {
    console.log(error);
  }
};

const pathMaker = (basePath, requiredPath) => {
  let absPath = "";
  if (_.startsWith(requiredPath, "./")) {
    let chunksOfBasePath = basePath.split("/");
    let chunksOfRequiredPath = [];
    _.map(requiredPath.split("/"), (p) => {
      if (p === ".") {
      } else if (p === "..") {
        chunksOfBasePath.pop();
      } else {
        chunksOfRequiredPath.push(p);
      }
    });
    _.map(chunksOfBasePath, (c) => {
      if (c) {
        absPath = absPath + "/" + c;
      }
    });
    _.map(chunksOfRequiredPath, (c) => {
      absPath = absPath + "/" + c;
    });

    return absPath;
  }
  return "";
};
const filePathMaker = (filePath) => {
  if (fs.existsSync(filePath + ".js")) {
    return filePath + ".js";
  } else if (fs.existsSync(filePath + "/index.js")) {
    return filePath + "/index.js";
  } else {
    return filePath;
  }
};

module.exports = converter;
filePathMaker;
