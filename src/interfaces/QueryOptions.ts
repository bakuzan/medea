import { RequestInit } from "node-fetch";

export interface QueryOptions {
  body?: RequestInit["body"];
  dataFn?:
    | "json"
    | "text"
    | "buffer"
    | "arrayBuffer"
    | "blob"
    | "textConverted";
  queryOptions?: RequestInit;
  shouldLog?: boolean;
}
