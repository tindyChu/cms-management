import React from "react";

import { Store } from "../../../Store";
import { IInputField } from "../../../interfaces";
import deep from "../../../utils/deep";
import validation from "../../../utils/validation";
import t from "../../../utils/translation";
import Error from "./Error";

export default function Input({
  dispatchType: dispatchTypeP,
  fields: fieldsP,
  name: nameP,
  lang: langP,
  type: typeP,
  label: labelP,
  className: classNameP,
  deepPath: deepPathP,
  handleChange: handleChangeP,
  ...restP
}: IInputField): JSX.Element {
  const { state, dispatch } = React.useContext(Store);

  let formS = state[dispatchTypeP] || {};
  formS.data = formS.data || {};

  const certainData = deep.get(
    `data${deepPathP ? `.${deepPathP}` : ""}`,
    formS
  );
  const id = `${deepPathP ? `${deepPathP}-` : ""}${nameP}`;
  const isError = deep.get(
    `errors${deepPathP ? `.${deepPathP}` : ""}.${nameP}`,
    formS
  );

  let handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
  if (typeof handleChangeP === "function") {
    handleChange = (e) => {
      handleChangeP(e);
    };
  } else {
    handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const input = e.currentTarget;
      certainData[input.name] = input.value;
      validation.handleCertain(e, formS, fieldsP, deepPathP);
      dispatch({ type: dispatchTypeP, payload: formS });
    };
  }

  return (
    <div className={`${classNameP || "col-sm-12"} form-group`} key={id}>
      {labelP && <label htmlFor={id}>{t(labelP)} :</label>}
      <input
        id={id}
        name={nameP}
        type={typeP}
        data-lang={langP}
        value={certainData[nameP] || ""}
        onChange={(e) => handleChange(e)}
        className={`form-control${isError ? " is-invalid " : ""}`}
        {...restP}
      />
      {isError && (
        <Error
          dispatchType={dispatchTypeP}
          fieldName={nameP}
          deepPath={deepPathP}
        />
      )}
    </div>
  );
}
