import React from "react";

import { Store } from "../../../Store";
import { IError } from "../../../interfaces";
import deep from "../../../utils/deep";
import t from "../../../utils/translation";

export default function Error({
  dispatchType: dispatchTypeP,
  fieldName: fieldNameP,
  deepPath: deepPathP,
}: IError): JSX.Element {
  const { state } = React.useContext(Store);
  const formS = state[dispatchTypeP] || {};
  if (formS.errors) {
    const certainErr = deep.get(
      `errors${deepPathP ? `.${deepPathP}` : ""}`,
      formS
    );
    if (certainErr.hasOwnProperty(fieldNameP)) {
      const errorsMsg: Array<string> = [];
      for (const schema in certainErr[fieldNameP]) {
        const { msg, ...replacements } = certainErr[fieldNameP][schema];
        errorsMsg.push(t(msg, replacements));
      }

      // use index because the order no important
      return (
        <span key={`err-${fieldNameP}`} className="error invalid-feedback">
          {errorsMsg.map((msg, i) => (
            <span key={`err-${fieldNameP}-${i}`}>
              {`-${msg}`}
              <br />
            </span>
          ))}
        </span>
      );
    }
  }

  return <></>;
}
