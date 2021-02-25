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
const dirTree = require("directory-tree");
const converter = async (req, resp) => {
  try {
    const body = req.body;
    const tree = dirTree(body.path);    
    // console.log("🚀 ~ file: converter.js ~ line 20 ~ converter ~ tree ", tree )
    let response = await ast(body.starts, body.path);
    return resp.json(_.extend(response,{tree}));
  } catch (error) {
    console.log(error);
    return resp.json(error);
  }
};

const ast = async (file, basePath) => {
  let stringifyCode = fs.readFileSync(file).toString();
  let astC = babylon.parse(stringifyCode);
  // const val = _.flatMapDeep(astC)
// _.map(val,v=>{console.log(v.type)})
  // console.log("🚀 ~ file: converter.js ~ line 32 ~ ast ~ val", val)
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
    let chunksOfBasePath =_.compact(basePath.split("/"));
    let chunksOfRequiredPath = [];
    _.map(_.compact(requiredPath.split("/")), (p) => {
      if (p === ".") {
      } else if (p === "..") {
        chunksOfBasePath.pop();
      } else {
        chunksOfRequiredPath.push(p);
      }
    });
    if(process.platform==='win32'){
      _.map(chunksOfBasePath, (c) => {
        if (c) {
          absPath = absPath + c + "/";
        }
      });
      _.map(chunksOfRequiredPath, (c) => {
        absPath = absPath + c + "/";
      });
    }
    else{
      _.map(chunksOfBasePath, (c) => {
        if (c) {
          absPath = absPath  + "/"+ c;
        }
      });
      _.map(chunksOfRequiredPath, (c) => {
        absPath = absPath  + "/"+ c;
      });
    }
    if(_.endsWith(absPath,"/")){
       absPath = absPath.slice(0, -1)
    }
    return absPath;
  }
  return "";
};
const filePathMaker = (filePath) => {
    if (fs.existsSync(filePath + "/index.js")) {
      return {filePath : filePath + "/index.js",basePath:filePath};
    } else if (fs.existsSync(filePath + ".js")) {
      console.log("_.lastIndexOf(filePath",_.lastIndexOf(filePath,"/"))
      let basePath =filePath.substring(0,_.lastIndexOf(filePath,"/")+1)

      return {filePath: filePath + ".js",basePath:basePath};

    } else {
      return {filePath,basePath};
    }
};

module.exports = { ast, converter, pathMaker, filePathMaker };
