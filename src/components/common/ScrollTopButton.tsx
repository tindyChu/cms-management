import React from "react";

import { Store } from "../../Store";
import t from "../../utils/translation";

import "../../style/scrollTopButton.scss";

export default function ScrollTopButton(): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const { scrollTopButton: scrollTopButtonS } = state;
  const dispatchType = "scrollTopButton";

  React.useEffect(() => {
    const toggleVisibility = (): void => {
      if (window.pageYOffset > 60) {
        if (!scrollTopButtonS.visibility) {
          scrollTopButtonS.visibility = true;
          updateState();
        }
      } else {
        if (scrollTopButtonS.visibility) {
          scrollTopButtonS.visibility = false;
          updateState();
        }
      }
    };

    const updateState = () => {
      dispatch({
        type: dispatchType,
        payload: scrollTopButtonS,
      });
    };

    document.addEventListener("scroll", toggleVisibility);
  }, [dispatch, scrollTopButtonS]);

  const scrollToTop = (): void => {
    window.scroll(0, 0);
  };

  return scrollTopButtonS.visibility ? (
    <button
      title={t("Back to top")}
      className="btn btn-warning btn-lg scroll-btn"
      onClick={scrollToTop}
    >
      <i className="fas fa-chevron-up" />
    </button>
  ) : (
      <></>
    );
}
