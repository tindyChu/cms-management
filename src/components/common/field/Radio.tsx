import React from "react";

import { Store } from "../../../Store";
import { TObject } from "../../../interfaces";
import deep from "../../../utils/deep";
import t from "../../../utils/translation";

export default function Radio({
  dispatchType: dispatchTypeP,
  fields: fieldsP,
  name: nameP,
  type: typeP,
  label: labelP,
  className: classNameP,
  deepPath: deepPathP,
  handelClick: handelClickP,
  options: optionsP,
  ...restP
}: any): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  let formS = state[dispatchTypeP] || {};
  formS.data = formS.data || {};
  const certainData = deep.get(
    `data${deepPathP ? `.${deepPathP}` : ""}`,
    formS
  );

  const id = `${deepPathP ? `${deepPathP}-` : ""}${nameP}`;

  let handelClick = (e: React.ChangeEvent<HTMLInputElement>) => {};
  if (typeof handelClickP === "function") {
    handelClick = (e) => {
      handelClickP(e);
    };
  } else {
    handelClick = (e: React.ChangeEvent<HTMLInputElement>): void => {
      e.preventDefault();
      const input = e.currentTarget;
      certainData[input.name] = input.value;
      dispatch({ type: dispatchTypeP, payload: formS });
    };
  }

  return (
    <div className={`${classNameP || "col-sm-12"} form-group`} key={id}>
      {labelP && <label htmlFor={id}>{t(labelP)} :</label>}
      {optionsP &&
        optionsP.map((current: TObject) => {
          const isCheck = String(certainData[nameP]) === String(current.value);
          return (
            <div className="col" key={id + current.value}>
              <input
                id={id + current.value}
                name={nameP}
                type="radio"
                onClick={handelClick}
                className={`${isCheck ? "checked" : ""}`}
                value={current.value}
                {...restP}
              />
              {current.label && (
                <label htmlFor={id + current.value}>
                  {t(current.label)}&nbsp;&nbsp;
                </label>
              )}
            </div>
          );
        })}
    </div>
  );
}
