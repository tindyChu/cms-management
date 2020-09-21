import React from "react";
import { Store } from "../../../Store";
import { TObject } from "../../../interfaces";
import t from "../../../utils/translation";

export default function Head({ fields: fieldsP }: TObject): JSX.Element {
  const { state } = React.useContext(Store);
  const { languageArr: languageArrS } = state;

  return (
    <thead>
      <tr>
        {fieldsP.map((field: TObject) => {
          if (field.label.slice(-1) === "_") {
            const label = field.label.slice(0, -1);
            return languageArrS.map((language) => (
              <th
                className={field.className ? field.className : ""}
                key={label + language.name}
              >
                {t(label)}({language.name})
              </th>
            ));
          } else {
            return (
              <th
                className={field.className ? field.className : ""}
                key={field.name}
              >
                {t(field.label)}
              </th>
            );
          }
        })}
        <th>{t("Action")}</th>
      </tr>
    </thead>
  );
}
