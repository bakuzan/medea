import describeArgs from "./describeArgs";
import parseArgs from "./parseArgs";
import query from "./query";
import readIn from "./readIn";
import writeOut from "./writeOut";

import {
  accessAsync,
  readdirAsync,
  readFileAsync,
  writeFileAsync,
  pathFix
} from "./utils";

export default {
  // Node Asyncs
  accessAsync,
  readdirAsync,
  readFileAsync,
  writeFileAsync,
  // Library features
  describeArgs,
  parseArgs,
  pathFix,
  query,
  readIn,
  writeOut
};
