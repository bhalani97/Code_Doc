import * as types from "@babel/types";
import traverse from "@babel/traverse";
import { TYPES } from "./constants/Types";
const _ = require("lodash");
const trav = (ast, want) => {
  let fun = [];
  traverse(ast, {
    enter(path) {
      switch (want) {
        case TYPES.CallExpression:
          if (types.isCallExpression(path.node)) {
            console.log(
              "🚀 ~ file: traverse.js ~ line 11 ~ enter ~ path.node",
              path.node
            );
            console.log(path.node.arguments);
            if (path.node.callee.name && path.node.callee.name !== "require") {
              fun.push({
                name: path.node.callee.name,
                leadingComments: path.node.leadingComments,
              });
            }
          }
          break;
        case TYPES.VariableDeclaration:
          if (types.isVariableDeclaration(path.node)) {
            _.map(path.node.declarations, (dec) => {
              if (dec.id.name) {
                fun.push({
                  name: dec.id.name,
                  leadingComments: path.node.leadingComments,
                });
              }
              if (_.size(dec.id.properties)) {
                _.map(dec.id.properties, (p) => {
                  fun.push({
                    name: p.value.name,
                    leadingComments: path.node.leadingComments,
                  });
                });
              }
            });
          }
        case TYPES.FunctionDeclaration:
          if (types.isFunctionDeclaration(path.node)) {
            if (path.node.id.name) {
              fun.push({
                name: path.node.id.name,
                leadingComments: path.node.leadingComments,
              });
            }
          }
        default:
      }
    },
  });
  console.log("🚀 ~ file: traverse.js ~ line 21 ~ trav ~ fun", fun);
  return _.uniq(fun);
};
export { trav };
