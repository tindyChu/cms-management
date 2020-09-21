import React from "react";
import { NavLink } from "react-router-dom";

import { Store } from "../../Store";
import { TObject } from "../../interfaces";
import { getLangUrl, toggleElement } from "../../utils/common";
import auth from "../../utils/auth";
import t from "../../utils/translation";

export default function Menu(): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const { leftNav: leftNavS } = state;

  const menu: Array<TObject> = [
    {
      name: "Home banner",
      to: "home-banner",
      icon: "far fa-images",
    },
    {
      name: "Item",
      to: "item",
      icon: "fa fa-boxes",
    },
    {
      name: "Site control",
      to: "site-control",
      icon: "fa fa-cogs",
      expand: false,
      children: [
        { name: "Admin", to: "admin" },
        { name: "Site info", to: "site-info" },
      ],
    },
  ];

  const expandMenu = (to: string): void => {
    const payload = leftNavS;
    toggleElement(payload.menu.expandedArr, to);
    dispatch({
      type: "leftNav",
      payload,
    });
  };

  const langUrl = getLangUrl();
  const Link = ({ current }: TObject): JSX.Element => {
    if (!auth.check(current.access || current.to, 2)) {
      return <></>;
    }

    return (
      <li className="nav-item" key={current.to}>
        <NavLink className="nav-link" to={`${langUrl}/${current.to}`}>
          <i className={`nav-icon fa ${current.icon || "fa-circle"}`} />
          <p>{t(current.name)}</p>
        </NavLink>
      </li>
    );
  };

  const Tree = ({ current }: TObject): JSX.Element => {
    const isMenuExpand = leftNavS.menu.expandedArr.includes(current.to);

    return (
      <>
        <li
          // cSpell:ignore treeview
          className={`nav-item has-treeview ${isMenuExpand && "menu-open"}`}
          key={current.to}
        >
          <span
            className="nav-link"
            onClick={() => {
              expandMenu(current.to);
            }}
          >
            <i className={`nav-icon fa ${current.icon || "fa-circle"}`} />
            <p>
              {t(current.name)}
              <i className="right fas fa-angle-left" />
            </p>
          </span>
          {isMenuExpand &&
            current.children.map((current: TObject) => (
              <ul className="nav nav-treeview menu-open" key={current.to}>
                {current.children ? (
                  <Tree current={current} />
                ) : (
                    <Link current={current} />
                  )}
              </ul>
            ))}
        </li>
      </>
    );
  };

  return (
    <>
      {menu.map((current) =>
        current.children ? (
          <Tree key={current.to} current={current} />
        ) : (
            <Link key={current.to} current={current} />
          )
      )}
    </>
  );
}
