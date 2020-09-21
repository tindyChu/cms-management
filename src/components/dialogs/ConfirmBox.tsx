import React from "react";

import { Store } from "../../Store";
import t from "../../utils/translation";

export default function ConfirmBox({ onClose }: any): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const { dialog: dialogS } = state;

  React.useEffect(() => {
    if (!dialogS.focus && refuseButtonRef.current) {
      refuseButtonRef.current.focus();
    } else {
      dialogS.focus.current.focus();
    }
  });

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.keyCode === 37 && dialogS.focus !== confirmButtonRef) {
      dialogS.focus = confirmButtonRef;
    } else if (e.keyCode === 39 && dialogS.focus !== refuseButtonRef) {
      dialogS.focus = refuseButtonRef;
    }
    dispatch({ type: "dialog", payload: dialogS });
  };

  const confirmButtonRef = React.useRef<HTMLButtonElement>(null);
  const refuseButtonRef = React.useRef<HTMLButtonElement>(null);
  const title = dialogS.title || "Do you confirm?";
  const desc = dialogS.desc ? <p>{t(dialogS.desc)}</p> : <br />;
  return (
    <div className="confirm-container">
      <h3>{t(title)}</h3>
      {desc}

      <button
        ref={confirmButtonRef}
        onKeyDown={handleKey}
        className="btn btn-warning"
        onClick={() => {
          onClose();
          if (typeof dialogS.onConfirm === "function") {
            dialogS.onConfirm();
          }
        }}
      >
        {t(dialogS.confirmHtml ? dialogS.confirmHtml : "Confirm")}
      </button>

      <button
        ref={refuseButtonRef}
        onKeyDown={handleKey}
        className="btn btn-secondary"
        onClick={onClose}
      >
        {t("Cancel")}
      </button>
    </div>
  );
}
