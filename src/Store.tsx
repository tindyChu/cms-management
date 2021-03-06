import React from "react";

import { IState, IAction, IContext, TObject } from "./interfaces";

const initialState: IState = {
  siteInfo: {},
  nav: { title: "" },
  languageArr: [],
  initialled: false,
  settingNav: { show: false, expandLanguageArr: false },
  leftNav: { expand: false, menu: { expandedArr: [] } },
  dialog: { show: false },
  scrollTopButton: { initialled: false, visibility: false },
};

function reducer(state: IState, action: IAction): IState {
  const type = action.type;

  if (type === "dialogLogin") {
    return { ...state, dialog: { show: true, type: "loginForm" } };
  } else if (type === "dialogMask") {
    return { ...state, dialog: { show: true, type: "mask" } };
  } else if (type === "dialogClose") {
    document.body.classList.remove("dialog-body");
    return {
      ...state,
      dialog: { show: false },
    };
  } else if (type === "delete") {
    if (typeof action.payload === "string") {
      console.log("delete", action.payload);
      delete state[action.payload];
    }
    return { ...state };
  } else {
    console.log("store", type);
    return { ...state, [type]: action.payload };
  }
}

export const Store = React.createContext({} as IContext);
export function StoreProvider(props: TObject): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, { ...initialState });

  return (
    <Store.Provider value={{ state, dispatch }}>
      {props.children}
    </Store.Provider>
  );
}
