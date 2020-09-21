import "react-app-polyfill/stable";

import React from "react";

import { StoreProvider } from "./Store";
import Initialization from "./components/Initialization";
import Router from "./components/Router";

import { TObject } from "./interfaces";

import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./style/main.scss";

export default function App(props: TObject): JSX.Element {
  return (
    <BrowserRouter>
      <StoreProvider {...props}>
        <Initialization />
        <Router />
      </StoreProvider>
    </BrowserRouter>
  );
}
