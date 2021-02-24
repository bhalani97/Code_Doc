const acorn = require("acorn");
const fs = require("fs");
const walk = require("acorn-walk");
const _ = require("lodash");
const path = require("path");
const extract = require("acorn-extract-comments");
const babylon = require("babylon");
const js2flowchart = require("js2flowchart");
const recast = require("recast");
const types = require("@babel/types");
const traverse = require("@babel/traverse");
const { ast } = require("./converter");
const {pathMaker,filePathMaker} = require("./converter")
const info = async (req, resp) => {
  try {
    const body = req.body;
    let response = {};
    response = await astHandler(body.fileName, body.basePath, body);
    return resp.json(response);
  } catch (error) {
    console.log(error);
  }
};

const astHandler = async (file, basePath, body) => {
  let stringifyCode = fs.readFileSync(file).toString();
  let astC = babylon.parse(stringifyCode);
  let response = await ObjectTypePattenRequireSolver(astC, body);
  if (_.size(Object.keys(response)) === 0) {
    response = await SimplePattenRequireSolver(astC, body);
  }
  if (_.size(Object.keys(response)) > 0) {
    return _.extend(response, { flag: true, message: "Success" });
  }
  return _.extend(response, {
    flag: false,
    message: "We could not find anything",
  });
};

const ObjectTypePattenRequireSolver = async (astC, body) => {
  try {
    let response = {};
    for (let i = 0; i < _.size(astC.program.body); i++) {
      let t = astC.program.body[i];
      if (t.type === "VariableDeclaration") {
        for (let j = 0; j < _.size(t.declarations); j++) {
          let d = t.declarations[j];
          if (d.init && d.init.callee && d.init.callee.name === "require") {
            // fs.writeFileSync("parsed1.json", JSON.stringify(d));
            for (let x = 0; x < _.size(d.id.properties); x++) {
              let p = d.id.properties[x];
              if (p.key.name === body.clickedPart) {
                for (let y = 0; y < _.size(d.init.arguments); y++) {
                  v = d.init.arguments[y];
                  let filePath = pathMaker(body.basePath, v.value);
                  if (filePath) {
                    let finalPath = filePathMaker(filePath);
                    if (_.endsWith(finalPath, ".js")) {
                      response = await ast(finalPath, filePath);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return response;
  } catch (error) {
    console.log(
      "🚀 ~ file: info.js ~ line 74 ~ ObjectTypePattenRequireSolver ~ error",
      error
    );
  }
};

const SimplePattenRequireSolver = async (astC, body) => {
  try {
    let response = {};
    for (let i = 0; i < _.size(astC.program.body); i++) {
      let t = astC.program.body[i];
      for (let j = 0; j < _.size(t.declarations); j++) {
        let d = t.declarations[j];
        if (d.init && d.init.callee && d.init.callee.name === "require" && d.id.name===body.clickedPart) {
          // fs.writeFileSync("parsed1.json", JSON.stringify(d));

          for (let y = 0; y < _.size(d.init.arguments); y++) {
            v = d.init.arguments[y];
            let filePath = pathMaker(body.basePath, v.value);
            if (filePath) {
              let finalPath = filePathMaker(filePath);
              if (_.endsWith(finalPath, ".js")) {
                response = await ast(finalPath, filePath);
              }
            }
          }
        }
      }
    }
    return response;
  } catch (error) {
    console.log(
      "🚀 ~ file: info.js ~ line 74 ~ ObjectTypePattenRequireSolver ~ error",
      error
    );
  }
};

module.exports = info;
