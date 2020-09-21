import React from "react";
import { Link } from "react-router-dom";

import { Store } from "../../Store";
import Menu from "./Menu";
import { getBaseUrl, getLangUrl } from "../../utils/common";

import "../../style/leftNav.scss";

export default function LeftNav() {
  const { state, dispatch } = React.useContext(Store);
  const { leftNav: leftNavS } = state;

  const foldLeftNav = (): void => {
    const payload = leftNavS;
    payload.expand = false;
    dispatch({
      type: "leftNav",
      payload,
    });
  };

  return (
    <>
      {leftNavS.expand && (
        <div className="right-mask" onClick={foldLeftNav}></div>
      )}

      <aside className="main-sidebar sidebar-dark-orange elevation-5">
        <Link className="brand-link navbar-gray" to={`${getLangUrl()}/`}>
          <img
            src={`${getBaseUrl()}/logo192.png`}
            alt="Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: 0.8 }}
          ></img>
          <span className="brand-text font-weight-light">{document.title}</span>
        </Link>

        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column nav-flat nav-child-indent">
              <Menu />
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
