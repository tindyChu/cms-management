import React from "react";

import { Store } from "../../Store";

const SettingNav = React.lazy<any>(() => import("./Setting"));

export default function HeadNav(): JSX.Element {
  const { state, dispatch } = React.useContext(Store);

  const toggleLeftNav = () => {
    const payload = state.leftNav;
    payload.expand = !payload.expand;

    dispatch({
      type: "leftNav",
      payload,
    });
  };

  const toggleSetting = () => {
    const payload = state.settingNav;
    payload.show = !payload.show;

    dispatch({
      type: "settingNav",
      payload,
    });
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-dark navbar-navy">
      <ul className="navbar-nav">
        <li className="nav-item">
          <span className="nav-link" onClick={toggleLeftNav}>
            <i className="fa fa-bars" />
          </span>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <span
            className={`nav-link${state.settingNav.show ? " active" : ""}`}
            onClick={toggleSetting}
          >
            <i className="fa fa-user-cog" />
          </span>
          {state.settingNav.show && (
            <React.Suspense fallback="">
              <SettingNav />
            </React.Suspense>
          )}
        </li>
      </ul>
    </nav>
  );
}
