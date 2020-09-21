import React from "react";

import LanguageDropdown from "./LanguageDropdown";
import Logout from "./Logout";
import { getStorage } from "../../utils/common";

import "../../style/settingNav.scss";

export default function SettingNav(): JSX.Element {
  const loginInfo = getStorage("LoginInfo");
  return (
    <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right show">
      <div className="dropdown-item dropdown-header">
        {loginInfo && loginInfo.email}
      </div>
      <div className="dropdown-divider"></div>

      <LanguageDropdown fistItemClass="dropdown-item" />

      <div className="dropdown-divider"></div>

      <Logout />
    </div>
  );
}
