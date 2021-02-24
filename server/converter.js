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

const converter = async (req, resp) => {
  try {
    const body = req.body;
    let response = await ast(body.starts, body.path);
    return resp.json(response);
  } catch (error) {
    console.log(error);
    return resp.json(error);
  }
};

const ast = async (file, basePath) => {
  let stringifyCode = fs.readFileSync(file).toString();
  let astC = babylon.parse(stringifyCode);
  return {
    basePath,
    fileName: file,
    code: stringifyCode,
    ast: astC,
  };
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
        absPath = absPath + c + "/";
      }
    });
    _.map(chunksOfRequiredPath, (c) => {
      absPath = absPath + c + "/";
    });

    return absPath;
  }
  return "";
};
const filePathMaker = (filePath) => {
  if (fs.existsSync(filePath + "index.js")) {
    return filePath + "index.js";
  } else if (fs.existsSync(filePath + ".js")) {
    return filePath + ".js";
  } else {
    return filePath;
  }
};

module.exports = { ast, converter, pathMaker, filePathMaker };
