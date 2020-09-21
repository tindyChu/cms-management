import React from "react";
import { Link } from "react-router-dom";

import { Store } from "../Store";
import { TObject } from "../interfaces";
import HeadNav from "./navigators/Head";
import LeftNav from "./navigators/Left";
import { getLangUrl } from "../utils/common";
import t from "../utils/translation";

export default function Frame({ children }: TObject): JSX.Element {
  const { state } = React.useContext(Store);
  const { nav: navS } = state;

  if (navS.links && navS.links[0].name !== "Home") {
    navS.links.unshift({ name: "Home", to: "/" });
  }

  return (
    <div className="wrapper">
      <div
        className={`sidebar-mini sidebar-${state.leftNav.expand ? "open" : "collapse"
          }`}
      >
        <HeadNav />
        <LeftNav />
        <div className="content-wrapper">
          {navS.title && (
            <div className="content-header">
              <div className="container-fluid">
                <div className="row mb-2">
                  <div className="col-sm-6">
                    <h1 className="m-0 text-dark">{t(navS.title)}</h1>
                  </div>
                  <div className="col-sm-6">
                    <ol className="breadcrumb float-sm-right">
                      {navS.links &&
                        navS.links.map((current, i) => {
                          const isLast =
                            navS.links && i === navS.links.length - 1;
                          const name = t(current.name);
                          return (
                            <li
                              key={current.name}
                              className={`breadcrumb-item ${isLast && "active"
                                }`}
                            >
                              {isLast || !current.to ? (
                                name
                              ) : (
                                  <Link to={`${getLangUrl()}${current.to}`}>
                                    {name}
                                  </Link>
                                )}
                            </li>
                          );
                        })}
                      {/* <li className="breadcrumb-item">
                        <Link to={`${getLangUrl()}/`}>{t("Home")}</Link>
                      </li>
                      <li className="breadcrumb-item active">
                        {t(navS.page)}
                      </li> */}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">{children}</div>
              </div>
            </div>
          </div>
        </div>

        <footer className="main-footer text-sm">
          <strong>
            Copyright &copy; 2019 <a href="http://adminlte.io">LjoINK.com</a>.
          </strong>
          All rights reserved.
          <div className="float-right d-none d-sm-inline-block">
            <b>Version</b> 0.0.1
          </div>
        </footer>
      </div>
    </div>
  );
}
