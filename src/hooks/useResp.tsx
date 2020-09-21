import React from "react";
import { toast } from "react-toastify";

import { Store } from "../Store";
import { TObject, TRespHandler } from "../interfaces";
import t from "../utils/translation";

type TH = (resp: TObject, respHandler: TRespHandler, ...rest: any) => void;
export default function useResp(): { handleResp: TH } {
  const { dispatch } = React.useContext(Store);

  const alertErr = (dataMsg: string): void => {
    const msgArr = dataMsg.split("\r\n");
    for (const msg of msgArr) {
      if (msg) {
        toast.error(t(msg));
      }
    }
  };

  const handleResp = (
    resp: TObject,
    respHandler: TRespHandler,
    ...rest: any
  ): void => {
    if (resp.status === 401) {
      if (typeof respHandler["401"] === "function") {
        respHandler["401"](resp.data, ...rest);
      } else {
        alertErr(resp.data.Msg);

        dispatch({
          type: "dialog",
          payload: {
            show: true,
            type: "loginForm",
          },
        });
      }
    } else {
      if (typeof respHandler[resp.status] === "function") {
        respHandler[resp.status](resp.data, ...rest);
      } else if (typeof respHandler.else === "function") {
        respHandler.else(resp.data, ...rest);
      } else {
        alertErr(resp.data.Msg);
      }
    }
    if (typeof respHandler.finally === "function") {
      respHandler.finally(resp.data, ...rest);
    }
  };

  return { handleResp };
}
