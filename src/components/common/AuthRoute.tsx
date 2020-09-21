import React from "react";
import { Route } from "react-router-dom";

import { TObject } from "../../interfaces";
import Frame from "../Frame";
import auth from "../../utils/auth";
import LoginForm from "../forms/Login";

import "../../style/adminLte.css";
import "../../style/customAdmin.scss";

export const AuthRoute = ({
  component: Component,
  lazy: Lazy,
  ...rest
}: TObject): JSX.Element => {
  if (!auth.isLogin()) {
    return <LoginForm />;
  } else {
    return (
      <Route
        {...rest}
        render={() => (
          <Frame>
            {Component ? (
              <Component />
            ) : (
                <React.Suspense fallback="">
                  <Lazy />
                </React.Suspense>
              )}
          </Frame>
        )}
      />
    );
  }
};
