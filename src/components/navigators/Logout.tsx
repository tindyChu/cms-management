import React from "react";
import { toast } from "react-toastify";

import { Store } from "../../Store";
import { TObject } from "../../interfaces";
import auth from "../../utils/auth";
import { getLangUrl } from "../../utils/common";
import http from "../../utils/http";
import t from "../../utils/translation";

export default function Logout() {
  const { dispatch } = React.useContext(Store);

  const onConfirm = async (): Promise<void> => {
    dispatch({ type: "dialogMask" });

    const config: TObject = http.defaultConfig;
    const csrf = await http.getCsrfToken();
    http.handleCsrf(csrf, config);

    const { data, status } = await http.get("admin/logout", config);
    if (status === 200) {
      auth.removeStorage();
      document.location.href = `${getLangUrl()}/login`;
    } else {
      toast.error(data.Msg);
    }
  };

  const handleLogOut = () => {
    dispatch({
      type: "dialog",
      payload: {
        show: true,
        title: "Do you logout?",
        type: "confirm",
        onConfirm,
      },
    });
  };

  return (
    <div className="dropdown-item" onClick={handleLogOut}>
      <i className="fa fa-sign-out-alt" />
      &nbsp;
      {t("Logout")}
    </div>
  );
}
