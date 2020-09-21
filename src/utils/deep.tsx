import { TObject } from "../interfaces";
import { isInt } from "../utils/common";

const getKey = (val: string): string | number => {
  return isInt(val) ? parseInt(val) : val;
};

const get = (path: string, obj: TObject): any | undefined => {
  const paths = path.split(".");
  let r = obj;
  for (let i = 0; i < paths.length; i++) {
    if (!paths[i]) {
      throw new Error(`Path error. (${path})`);
    }
    const key = getKey(paths[i]);

    if (isInt(key)) {
      if (r[key] === undefined) {
        return undefined;
      }
      r = r[key];
    } else {
      if (!r.hasOwnProperty(key)) {
        return undefined;
      }
      r = r[key];
    }
  }
  return r;
};

// create obj or arr if parent not exist, assign value to ref
const set = (path: string, obj: TObject, value?: any): void => {
  const paths: string[] = path.split(".");
  let tmp: TObject = obj;
  for (let i = 0; i < paths.length; i++) {
    if (!paths[i]) {
      throw new Error(`Path error. (${path})`);
    }
    const key = getKey(paths[i]);

    const isLast = i === paths.length - 1;
    if (isLast) {
      if (typeof value !== undefined) {
        tmp[key] = value;
      } else if ((isInt(key) && !tmp[key]) || !tmp.hasOwnProperty(key)) {
        tmp[key] = "";
      }
    } else if (!tmp[key]) {
      if (isInt(paths[i + 1])) {
        tmp[key] = [];
      } else {
        tmp[key] = {};
      }
    }
    tmp = tmp[key];
  }
};

const deleteElem = (path: string, obj: TObject): TObject => {
  const paths: string[] = path.split(".");
  let tmp: TObject = obj;
  for (let i = 0; i < paths.length; i++) {
    if (!paths[i]) {
      throw new Error(`Path error. (${path})`);
    }
    const key = getKey(paths[i]);

    if (i === paths.length - 1) {
      delete tmp[key];
    } else {
      if (typeof tmp[key] === undefined) {
        break;
      }
      tmp = tmp[key];
    }
  }

  return obj;
};

export default {
  get,
  set,
  deleteElem,
};
