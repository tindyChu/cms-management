import React from "react";
import RectSelect from "react-select";

import { Store } from "../../../Store";
import { TObject, ISelectField } from "../../../interfaces";
import deep from "../../../utils/deep";
import t from "../../../utils/translation";

export default function Select({
  dispatchType: dispatchTypeP,
  name: nameP,
  label: labelP,
  className: classNameP,
  options: optionsP,
  deepPath: deepPathP,
  handleChange: handleChangeP,
}: ISelectField): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  let formS = state[dispatchTypeP] || {};
  formS.data = formS.data || {};

  const nameDeepPath = `data${deepPathP ? `.${deepPathP}` : ""}.${nameP}`;

  const getSelectValue = (value: any, options: Array<TObject>): TObject => {
    return options.filter((current: TObject) => current.value === value)[0];
  };

  let handleChange = (opt: TObject): void => {};
  if (typeof handleChangeP === "function") {
    handleChange = handleChangeP;
  } else {
    handleChange = (opt: TObject): void => {
      deep.set(nameDeepPath, formS, opt.value);
      dispatch({ type: dispatchTypeP, payload: formS });
    };
  }

  const id = `${deepPathP}-${nameP}`;
  const options = optionsP || [];
  const value = getSelectValue(formS.data[nameP], options);
  return (
    <div className={`${classNameP || "col-sm-12"} form-group`}>
      {labelP && <label htmlFor={id}>{t(labelP)} :</label>}
      <RectSelect
        key={id}
        id={id}
        name={nameP}
        options={options}
        placeholder=" --- "
        value={value}
        onChange={(opt) => handleChange(opt)}
      />
    </div>
  );
}
