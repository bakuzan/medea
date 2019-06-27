import { promisify } from "util";
import fs from "fs";
import path from "path";

export const accessAsync = promisify(fs.access);
export const readdirAsync = promisify(fs.readdir);
export const readFileAsync = promisify(fs.readFile);
export const writeFileAsync = promisify(fs.writeFile);

export const pathFix = (...strs: string[]) => path.resolve(path.join(...strs));

export function typedKeys<T>(o: T): (keyof T)[] {
  // type cast should be safe because that's what really Object.keys() does
  return Object.keys(o) as (keyof T)[];
}
