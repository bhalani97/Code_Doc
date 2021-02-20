const acorn = require("acorn");
const fs = require("fs");
const walk = require("acorn-walk");
const _ = require("lodash");
const path = require("path");
const e = require("cors");
const extract = require("acorn-extract-comments");
const babylon = require("babylon");
const js2flowchart = require("js2flowchart");
const recast = require('recast')
const {
  ABSTRACTION_LEVELS,
  createFlowTreeBuilder,
  convertFlowTreeToSvg,
} = js2flowchart;
const flowTreeBuilder = createFlowTreeBuilder();
flowTreeBuilder.setAbstractionLevel([
  ABSTRACTION_LEVELS.IMPORT,
  ABSTRACTION_LEVELS.EXPORT,
]);

const converter = (req, resp) => {
  try {
    const body = req.body;
    console.log(body);
    let temp = "";
    let response = ast(body.path + "/app.js", body.path);
    return response;
    // temp = fs.readFileSync(body.path + "/app.js");
    // temp = acorn.parse(temp.toString());
    // _.forEach(temp.body, (t, i) => {
    //   if (t.type === "VariableDeclaration") {
    //     _.forEach(t.declarations, (d, j) => {
    //       if (d.init && d.init.callee && d.init.callee.name === "require") {
    //         _.forEach(d.init.arguments, (v, k) => {
    //           // console.log("Hi",v.value)
    //           // let recPath = body.path;
    //           let filePath = pathMaker(body.path, v.value);
    //           if (filePath) {
    //             console.log(
    //               "🚀 ~ file: converter.js ~ line 23 ~ _.forEach ~ filePath",
    //               filePathMaker(pathMaker(body.path, v.value))
    //             );
    //           }
    //         });
    //       }
    //     });
    //   }
    // });
    // // walk.simple(temp, {
    // ExpressionStatement(node) {
    // console.log("🚀 ~ file: converter.js ~ line 13 ~ Literal ~ node", node);
    // },
    // });
    return resp.send({ data: response });
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

const ast = async (file, basePath) => {
  console.log("🚀 11 = ", file);
  temp = fs.readFileSync(file);

  // let conData = convertCodeToFlowTree(temp.toString());
  // // console.log(conData)
  // _.map(conData.body, (d) => {
  //   // console.log("🚀 ~ file: converter.js ~ line 97 ~ ast ~ d", d);
  //   if (d.name === "app.use('/api', hasDeviceToken, device)") {
  //     console.log("Hi", d.parent.parent[0].body);
  //   }
  // });

  // fs.writeFileSync("routes.json", JSON.stringify(data));

  // const comments = extract.(temp.toString(), {})
  temp = babylon.parse(temp.toString());
  const { Parser } = require("acorn")

  const ast1 = Parser.parse(fs.readFileSync(file).toString())
  const functionNames = [];
  recast.visit(ast1, visitFunctionDeclaration = (path) => {
    console.log(path.node.type);
    functionNames.push(path.node.id.name);
    return false;
  })
  console.log("🚀 ~ file: converter.js ~ line 126 ~ ast ~ functionNames", functionNames)

  

  // console.log("🚀 ~ file: converter.js ~ line 95 ~ ast ~ comments", temp);
  _.forEach(temp.program.body, (t, i) => {
    if (t.type === "VariableDeclaration") {
      _.forEach(t.declarations, (d, j) => {
        if (d.init && d.init.callee && d.init.callee.name === "require") {
          // console.log("🚀 ~ file: converter.js ~ line 102 ~ _.forEach ~ d.init.arguments", d.init.arguments)
          _.forEach(d.init.arguments, (v, k) => {
            let filePath = pathMaker(basePath, v.value);
            if (filePath) {
              let finalPath = filePathMaker(filePath);
              if (_.endsWith(finalPath, ".js")) {
                console.log("🚀 12 = ", finalPath);
                temp.program.body = ast(finalPath, filePath);
              }
            }
          });
        }
      });
    }
  });
  return temp;
};

const pathMaker = (basePath, requiredPath) => {
  let absPath = "";
  if (_.startsWith(requiredPath, "./") || _.startsWith(requiredPath, "../")) {
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
  if (fs.existsSync(filePath + "/index.js")) {
    return filePath + "/index.js";
  } else if (fs.existsSync(filePath + ".js")) {
    return filePath + ".js";
  } else {
    return filePath;
  }
};

module.exports = converter;
filePathMaker;
