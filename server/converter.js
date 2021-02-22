const acorn = require("acorn");
const fs = require("fs");
const walk = require("acorn-walk");
const _ = require("lodash");
const path = require("path");
const e = require("cors");
const extract = require("acorn-extract-comments");
const babylon = require("babylon");
const js2flowchart = require("js2flowchart");
const recast = require("recast");
const { stringify } = require("querystring");
const types = require("@babel/types");
const traverse = require("@babel/traverse");
console.log("🚀 ~ file: converter.js ~ line 14 ~ traverse",typeof traverse)
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

const converter = async (req, resp) => {
  try {
    const body = req.body;
    console.log(body);
    let temp = "";
    let response = await ast(body.path + "/app.js", body.path);
    return resp.json(response);
  } catch (error) {
    console.log(error);
  }
};

const ast = async (file, basePath) => {
  let stringifyCode = fs.readFileSync(file).toString();
  let astC = babylon.parse(stringifyCode);
  console.log("FILE NAME", file);
  // fs.writeFileSync("parsed1.json", JSON.stringify(astC));

  // traverse(astC, {
  //   CallExpression: function (path) {
  //     console.log(path);
  //   },
  // });

  return {
    basePath,
    fileName: file,
    code: stringifyCode,
    ast: astC,
  };
  _.forEach(astC.program.body, (t, i) => {
    _.forEach(t.declarations, (d, j) => {
      if (d.init.type === "CallExpression") {
        console.log(stringifyCode.substring(d.init.start, d.init.end));
      }
    });
  });
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
                // temp.program.body = ast(finalPath, filePath);
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
