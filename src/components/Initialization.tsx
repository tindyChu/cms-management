import React from "react";

import { useHistory } from "react-router-dom";

import { Store } from "../Store";
import { IAction, TDispatchType } from "../interfaces";
import http from "../utils/http";
import { getBaseUrl, getStorage, setStorage } from "../utils/common";

export default function Initialization(): null {
  const { state, dispatch } = React.useContext(Store);

  const storedLang = getStorage("Lang");
  const updateTitle = (): void => {
    if (state.siteInfo[`name_${storedLang}`]) {
      document.title = state.siteInfo[`name_${storedLang}`];
    }
  };

  const history = useHistory();

  let segmentArr = history.location.pathname.split("/");
  const langIndex = getBaseUrl() ? 2 : 1;
  const urlLang = segmentArr[langIndex];

  React.useEffect(() => {
    const genPromise = (
      path: string,
      type: TDispatchType
    ): Promise<IAction> => {
      return new Promise<IAction>((resolve) => {
        (async () => {
          const resp = await http.get(path);
          if (resp.status === 200) {
            resolve({ type, payload: resp.data });
          }
        })();
      });
    };

    const storeLang = () => {
      let segmentArrLanguage;
      if (urlLang) {
        segmentArrLanguage = state.languageArr.find(
          (current) => current.code === urlLang
        );
      }

      let langCode = "";
      if (segmentArrLanguage && segmentArrLanguage.hasOwnProperty("code")) {
        langCode = segmentArrLanguage.code;
      } else if (!storedLang) {
        const defaultLanguage = state.languageArr.filter(
          (current) => current.is_default === "true"
        );
        langCode =
          defaultLanguage.length === 0 ? "en" : defaultLanguage[0].code;
      }

      if (langCode) {
        setStorage("Lang", langCode);
      }
    };

    (async () => {
      const actions = await Promise.all([
        genPromise("language", "languageArr"),
        genPromise("site-info/1", "siteInfo"),
      ]);

      actions.forEach((current) => {
        state[current.type] = current.payload;
        dispatch(current);
      });
      dispatch({ type: "initialled", payload: true });

      storeLang();
      updateTitle();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    updateTitle();

    const urlPushLang = (): void => {
      segmentArr.splice(langIndex, 0, storedLang);
      const path = `${segmentArr.join("/")}${history.location.search}`;
      history.push(
        path.charAt(path.length - 1) === "/" ? path.slice(0, -1) : path
      );
    };

    // modifyUrl
    (() => {
      if (urlLang) {
        if (urlLang !== storedLang) {
          const langCodeArr = state.languageArr.map((current) => current.code);
          // eslint-disable-next-line react-hooks/exhaustive-deps
          segmentArr = segmentArr.filter(
            //delete all url.lang if url.lang !== lang
            (current) => !langCodeArr.includes(current)
          );
          urlPushLang();
        }
      } else {
        urlPushLang();
      }
    })();
  }, [storedLang]);

  return null;
}
