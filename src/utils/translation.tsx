import tc from "../translations/tc.json";
import sc from "../translations/sc.json";
import { TObject } from "../interfaces";
import { getStorage } from "./common";

const trans: TObject = { tc, sc };
const t = (s: string, replacements?: TObject): string => {
  const lang = getStorage("Lang");
  if (trans.hasOwnProperty(lang) && typeof trans[lang] === "object") {
    s = trans[lang][s] || s;
  }
  for (const key in replacements) {
    const pattern = `%%${key}%%`;
    const value = replacements[key];
    while (s.indexOf(pattern) !== -1) {
      if (typeof value === "string") {
        s = s.replace(pattern, t(value));
      } else {
        s = s.replace(pattern, value);
      }
    }
  }
  return s;
};

export default t;
