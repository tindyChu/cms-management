import React from "react";
import { Store } from "../Store";
import t from "../utils/translation";

export default function Home(): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const { nav: navS } = state;

  React.useEffect(() => {
    navS.title = t("Home");
    delete navS.links;

    dispatch({
      type: "nav",
      payload: navS,
    });
  }, [dispatch, navS]);

  return <></>;
}
