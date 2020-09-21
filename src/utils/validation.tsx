import { IFormField, TObject } from "../interfaces";
import { isInt, getDataSet } from "../utils/common";
import deep from "../utils/deep";

const validateAll = (
  formData: TObject,
  fields: Array<IFormField>,
  languageArr: Array<TObject>
): TObject => {
  const errors: TObject = {};

  for (const field of fields) {
    if (field.name.slice(-1) === "_") {
      for (const language of languageArr) {
        const value = formData[field.name + language.code];
        doValidate(errors, formData, field, value, language.code);
      }
    } else {
      const value = formData[field.name];
      doValidate(errors, formData, field, value);
    }
  }

  return errors;
};

const validateArr = (
  formDataArr: Array<TObject>,
  fields: Array<IFormField>,
  languageArr: Array<TObject>
): TObject => {
  const errors: TObject = {};

  for (const field of fields) {
    if (field.name.slice(-1) === "_") {
      for (const language of languageArr) {
        for (const formData of formDataArr) {
          const value = formData[field.name + language.code];
          doValidate(errors, formData, field, value, language.code);
        }
      }
    } else {
      for (const formData of formDataArr) {
        const value = formData[field.name];
        doValidate(errors, formData, field, value);
      }
    }
  }

  return errors;
};

const handleCertain = (
  e: React.ChangeEvent<HTMLInputElement>,
  formS: TObject,
  fields: Array<IFormField>,
  deepPath: string
) => {
  const certainData = deep.get(`data${deepPath ? `.${deepPath}` : ""}`, formS);

  const errors = validateCertain(e, certainData, fields);

  const input = e.currentTarget;
  const errDeepPath = `errors${deepPath ? `.${deepPath}` : ""}`;
  const nameDeepPath = `${errDeepPath}.${input.name}`;

  if (Object.keys(errors).length === 0) {
    if (deep.get(errDeepPath, formS)) {
      deep.deleteElem(nameDeepPath, formS);
      if (deepPath) {
        if (Object.keys(deep.get(errDeepPath, formS)).length === 0) {
          deep.deleteElem(errDeepPath, formS);
        }
      }
      if (Object.keys(formS.errors).length === 0) {
        delete formS.errors;
      }
    }
  } else {
    deep.set(nameDeepPath, formS, errors[input.name]);
  }
};

const validateCertain = (
  e: React.ChangeEvent<HTMLInputElement>,
  formData: TObject,
  fields: Array<IFormField>
): TObject => {
  const input = e.currentTarget;
  const name = input.name;
  const lang = getDataSet(e).lang;

  const errors: TObject = {};
  const field = fields.filter((field) => {
    const origName = lang ? name.slice(0, -lang.length) : name;
    return field.name === origName;
  })[0];
  const value = formData[name];

  doValidate(errors, formData, field, value, lang);
  return errors;
};

export default {
  validateAll,
  validateArr,
  validateCertain,
  handleCertain,
};

const doValidate = (
  errors: TObject,
  formData: TObject,
  field: IFormField,
  value: any,
  lang?: string
): void => {
  if (field.schema) {
    const schemas = field.schema.split(";");
    const name = field.name + (lang ? lang : "");
    for (const schema of schemas) {
      const { fn, param } = getFnParam(schema);
      let error = callValidation(formData, value, fn, param);
      if (error !== null) {
        if (errors[name] === undefined) {
          errors[name] = {};
        }
        errors[name][fn] = error;
      }
    }
  }
};

const getFnParam = (schema: string): { fn: string; param?: string } => {
  const open = schema.indexOf("[");
  const close = schema.indexOf("]");
  if (open !== -1 && close !== -1 && open < close) {
    return {
      fn: schema.substring(0, open),
      param: schema.substring(open + 1, close),
    };
  } else {
    return { fn: schema };
  }
};

// if valid return null
const callValidation = (
  formData: TObject,
  value: any,
  fn: string,
  param?: string
): TObject | null => {
  let error = null;
  switch (fn) {
    case "required":
      error = required(value);
      break;
    case "email":
      error = email(value);
      break;
    case "int":
      error = int(value);
      break;
    case "greaterEqual":
      error = greaterEqual(value, param);
      break;
    case "min":
      error = minLen(value, param);
      break;
    case "maxLen":
      error = maxLen(value, param);
      break;
    case "password":
      error = password(value);
      break;
    case "match":
      error = match(formData, value, param);
      break;
    case "mime":
      error = mime(value, param);
      break;
    case "maxSize":
      error = maxSize(value, param);
      break;
  }
  return error;
};

// *** start validation fn
const required = (value: any): TObject | null => {
  return value === undefined || value === ""
    ? { msg: "Please fill out this field" }
    : null;
};

const email = (value: any): TObject | null => {
  const patten = new RegExp(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    "g"
  );
  if (value && !value.match(patten)) {
    return { msg: "Please enter a valid email address" };
  }
  return null;
};

const int = (value: any): TObject | null => {
  if (value === "") {
    return null;
  }

  if (!isInt(value)) {
    return { msg: "Must be a integer" };
  }
  return null;
};

const greaterEqual = (value: any, param?: string): TObject | null => {
  const r = int(param);
  if (r) {
    return r;
  }

  const compare = Number(param);
  if (value && Number(value) < compare) {
    return { msg: `Should be greater than or equal to %%compare%%`, compare };
  }

  return null;
};

const minLen = (value: any, param?: string): TObject | null => {
  const r = int(param);
  if (r) {
    return r;
  }

  const compare = Number(param);
  if (value && value.length < compare) {
    return { msg: `At least %%compare%% characters`, compare };
  }

  return null;
};

const maxLen = (value: any, param?: string): TObject | null => {
  const r = int(param);
  if (r) {
    return r;
  }

  const compare = Number(param);
  if (value && value.length > compare) {
    return { msg: `Up to %%compare%% characters`, compare };
  }

  return null;
};

const password = (value: any): TObject | null => {
  const patten = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,14}$/,
    "g"
  );
  if (value && !value.match(patten)) {
    return {
      msg:
        "At least 8 characters; Up to 14 characters; Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number; Can contain special characters;",
    };
  }
  return null;
};

const match = (
  formData: TObject,
  value: any,
  param?: string
): TObject | null => {
  if (!param) {
    return { msg: "Must be a string" };
  }
  const compare = param;
  return formData[param] === value
    ? null
    : { msg: "Must match '%%compare%%'", compare };
};

const mime = (value: any, param?: string): TObject | null => {
  if (!value || !value.picked) {
    return null;
  }
  if (!param) {
    return { msg: "Must be a string" };
  }

  const params = param.split("|");
  const compares = [];
  for (const current of params) {
    const types = current.split("/");
    if (types.length !== 2) {
      return { msg: "Mime format errors" };
    }
    compares.push(types[1]);

    // e.g. value.type = "image/jpeg"
    if (current === value.picked.type) {
      return null;
    }
  }

  return { msg: "Type must be %%compare%%", compare: compares.join(", ") };
};

const maxSize = (value: any, param?: string): TObject | null => {
  const r = int(param);
  if (r) {
    return r;
  }

  if (!value || !value.picked) {
    return null;
  }

  if (!isInt(value.picked.size)) {
    return { msg: "Size error" };
  }

  const compare = Number(param);

  if (value.picked.size <= compare) {
    return null;
  }

  return {
    msg: "The maximum file size is %%compare%%MB",
    compare: compare / 1024 / 1024,
  };
};
