import { TObject, IFormField, TLanguage } from "../interfaces";

export const arrayToObject = (array: Array<any>): TObject => {
  return Object.assign({}, ...array);
};

export const isDuplicatedArr = (arr: Array<any>, key?: string): boolean => {
  const uniqueArr: Array<string> = [];

  for (const i in arr) {
    const value = key ? arr[i][key] : arr[i];
    if (uniqueArr.indexOf(value) === -1) {
      uniqueArr.push(value);
    } else {
      return true;
    }
  }
  return false;
};

export const getUniqueArr = (arr: Array<any>, key?: string): Array<string> => {
  const uniqueArr: Array<string> = [];

  for (const i in arr) {
    const value = key ? arr[i][key] : arr[i];
    if (uniqueArr.indexOf(value) === -1) {
      uniqueArr.push(value);
    }
  }
  return uniqueArr;
};

export const toggleElement = (arr: Array<string>, element: string): void => {
  if (arr.includes(element)) {
    //using arr.filter will make a new copy
    while (arr.includes(element)) {
      arr.splice(arr.indexOf(element), 1);
    }
  } else {
    arr.push(element);
  }
};

export const getEndpoint = (): string => {
  return process.env.REACT_APP_ENDPOINT || "";
};

export const getBaseUrl = (): string => {
  return process.env.PUBLIC_URL === "/" ? "" : process.env.PUBLIC_URL;
};

export const getLangUrl = (): string => {
  return `${getBaseUrl()}/${getStorage("Lang")}`;
};

const storageKey = "management";
export const getStorage = (key: string): any => {
  const storage = localStorage.getItem(key) || "{}";
  return JSON.parse(storage)[storageKey];
};

export const setStorage = (key: string, value: any): void => {
  const storage = localStorage.getItem(key) || "{}";
  const storageObj = JSON.parse(storage);
  storageObj[storageKey] = value || "";

  localStorage.setItem(key, JSON.stringify(storageObj));
};

export const isInt = (value: any): boolean => {
  return !isNaN(value) && parseInt(value) === Number(value);
};

export const getPayload = (
  certainData: TObject,
  fields: Array<IFormField>,
  languageArrS: Array<TLanguage>
): TObject | FormData => {
  const r = new FormData();

  for (const field of fields) {
    if (field.name.slice(-1) === "_") {
      for (const language of languageArrS) {
        const key = field.name + language.code;
        if (!certainData.hasOwnProperty(key)) {
          continue;
        }

        const value =
          field.type === "number"
            ? Number(certainData[field.name + language.code])
            : certainData[field.name + language.code];

        r.append(key, value);
      }
    } else {
      const key = field.name;
      if (!certainData.hasOwnProperty(key)) {
        continue;
      }

      let value;
      if (field.type === "number") {
        value = Number(certainData[field.name]);
      } else if (field.type === "file") {
        if (!certainData[field.name].picked) {
          continue;
        }
        value = certainData[field.name].picked;
      } else {
        value = certainData[field.name];
      }

      r.append(key, value);
    }
  }

  return r;
};

// implement for ie10 or below
export const getDataSet = (e: React.ChangeEvent<HTMLInputElement>): TObject => {
  const obj: TObject = {};
  if (e.currentTarget.dataset) {
    return e.currentTarget.dataset;
  } else {
    var data = e.target.attributes;
    for (var i = 0; i < data.length; i++) {
      var key = data[i].nodeName;
      if (/^data-\w+$/.test(key)) {
        var value = data[i].nodeValue;
        const tmp = key.match(/^data-(\w+)/);
        if (tmp) {
          const keyName = tmp[1];
          obj[keyName] = value;
        }
      }
    }
  }

  return obj;
};
