import React from "react";

import { Store } from "../../Store";
import { TObject } from "../../interfaces";
import { setStorage, getStorage } from "../../utils/common";

export default function LanguageDropdown({
  fistItemClass,
}: TObject): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const { settingNav: settingNavS } = state;

  const toggleSettingLanguage = (): void => {
    settingNavS.expandLanguageArr = !settingNavS.expandLanguageArr;

    dispatch({
      type: "settingNav",
      payload: settingNavS,
    });
  };

  const changeLang = (code: string): void => {
    setStorage("Lang", code);

    settingNavS.expandedLanguageArr = false;
    dispatch({
      type: "settingNav",
      payload: settingNavS,
    });
  };

  return (
    <>
      <div
        className={`${fistItemClass} has-tree ${
          settingNavS.expandLanguageArr && "menu-open"
        }`}
        onClick={toggleSettingLanguage}
      >
        <i className="fa fa-globe" />
        &nbsp;
        {
          state.languageArr.filter(
            (language) => language.code === getStorage("Lang")
          )[0].name
        }
        <i className="fa fa-angle-left right" />
      </div>

      {settingNavS.expandLanguageArr && (
        <ul>
          {state.languageArr.map((current) => {
            if (current.code === getStorage("Lang")) return null;
            return (
              <li
                key={current.code}
                onClick={() => {
                  changeLang(current.code);
                }}
              >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <i className="far fa-circle fa-xs" />
                &nbsp;
                {current.name}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
