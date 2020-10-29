import fs from "fs";
import path from "path";

let cache = path.join(process.cwd(), "cache");

export let set = (value: any) => fs.appendFileSync(cache, JSON.stringify(value));

export let get = <T>(): T | null => {
  try {
    return JSON.parse(fs.readFileSync(cache).toString());
  } catch {
    return null;
  }
};
