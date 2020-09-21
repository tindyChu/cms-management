import axios from "axios";
import { toast } from "react-toastify";

import { TObject } from "../interfaces";
import { getEndpoint } from "./common";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    const expectedError =
      err.response && err.response.status >= 400 && err.response.status < 500;

    if (!expectedError) {
      console.log("Error: ", err);
      toast("An unexpected error occurred");
    }
    return Promise.reject(err);
  }
);

axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Via"] = "mgt";
const defaultConfig = {
  headers: {
    "content-type": "application/x-www-form-urlencoded",
  },
  Cache: "no-cache",
};

const getCsrfToken = (): Promise<any> => {
  return axios
    .get(getEndpoint() + "csrf-token")
    .catch((err: TObject) => err.response);
};

const post = (url: string, data: TObject, config?: TObject): Promise<any> => {
  return axios
    .post(getEndpoint() + url, data, config ? config : defaultConfig)
    .catch((err: TObject) => err.response);
};

const get = (url: string, config?: TObject): Promise<any> => {
  return axios
    .get(getEndpoint() + url, config ? config : defaultConfig)
    .catch((err: TObject) => err.response);
};

const deleteAxios = (url: string, config?: TObject): Promise<any> => {
  return axios
    .delete(getEndpoint() + url, config ? config : defaultConfig)
    .catch((err: TObject) => err.response);
};

// if status !== 200, console log errorMsg
const handleCsrf = (obj: TObject, config: TObject): void => {
  if (obj.status !== 200) {
    console.log(obj.Msg);
  }
  config.headers["X-CSRF-Token"] = obj.data;
};

export default {
  get,
  post,
  delete: deleteAxios,
  getCsrfToken,
  handleCsrf,
  defaultConfig,
};
