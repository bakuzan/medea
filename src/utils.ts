import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export const accessAsync = promisify(fs.access);
export const copyFileAsync = promisify(fs.copyFile);
export const readdirAsync = promisify(fs.readdir);
export const readFileAsync = promisify(fs.readFile);
export const writeFileAsync = promisify(fs.writeFile);

export const pathFix = (...strs: string[]) => path.resolve(path.join(...strs));

export function typedKeys<T>(o: T): (keyof T)[] {
  // type cast should be safe because that's what really Object.keys() does
  return Object.keys(o) as (keyof T)[];
}

export function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
