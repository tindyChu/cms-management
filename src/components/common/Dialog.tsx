import React from "react";

import { Store } from "../../Store";

import ConfirmBox from "../dialogs/ConfirmBox";
import LoginForm from "../forms/Login";

import "../../style/dialog.scss";

export default function Dialog(): JSX.Element | null {
  const { state, dispatch } = React.useContext(Store);
  const { dialog: dialogS } = state;

  const handleBG = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.className === "dialog-mask") {
      handleClose();
    }
  };

  const handleClose = (): void => {
    if (dialogS.type !== "loginForm" && dialogS.type !== "mask") {
      dispatch({ type: "dialogClose" });
    }
  };

  if (dialogS.show) {
    document.body.classList.add("dialog-body");

    let Component;
    if (dialogS.type === "confirm") {
      Component = ConfirmBox;
    } else if (dialogS.type === "loginForm") {
      Component = LoginForm;
    } else if (dialogS.type === "mask") {
      Component = () => <></>;
    } else if (dialogS.component) {
      Component = dialogS.component;
    }

    return (
      <>
        <div className="dialog-mask" onClick={handleBG}>
          <div className="dialog-container">
            <Component onClose={handleClose} />
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
}
