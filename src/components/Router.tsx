import React from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { Store } from "../Store";
import { AuthRoute } from "./common/AuthRoute";
import Dialog from "./common/Dialog";
import ScrollTopButton from "./common/ScrollTopButton";

import LoginForm from "./forms/Login";
import { getLangUrl } from "../utils/common";

const Home = React.lazy<any>(() => import("./Home"));
const HomeBannerTable = React.lazy<any>(() => import("./tables/HomeBanner"));
const HomeBannerForm = React.lazy<any>(() => import("./forms/HomeBanner"));
const ItemTable = React.lazy<any>(() => import("./tables/Item"));
const ItemForm = React.lazy<any>(() => import("./forms/Item"));
const ItemFileForm = React.lazy<any>(() => import("./forms/ItemFile"));
const AdminTable = React.lazy<any>(() => import("./tables/Admin"));
const AdminForm = React.lazy<any>(() => import("./forms/Admin"));
const SiteInfoTable = React.lazy<any>(() => import("./tables/SiteInfo"));
const SiteInfoForm = React.lazy<any>(() => import("./forms/SiteInfo"));

export default function Router() {
  const { state } = React.useContext(Store);
  const { initialled: initialledS } = state;
  const langUrl = getLangUrl();

  if (initialledS) {
    return (
      <>
        <Switch>
          <Route path={`${langUrl}/login`} component={LoginForm} />

          <AuthRoute
            path={`${langUrl}/home-banner/form/:id`}
            lazy={HomeBannerForm}
          />
          <AuthRoute
            path={`${langUrl}/home-banner/form`}
            lazy={HomeBannerForm}
          />
          <AuthRoute path={`${langUrl}/home-banner`} lazy={HomeBannerTable} />

          <AuthRoute path={`${langUrl}/item/file/:id`} lazy={ItemFileForm} />
          <AuthRoute path={`${langUrl}/item/form/:id`} lazy={ItemForm} />
          <AuthRoute path={`${langUrl}/item/form`} lazy={ItemForm} />
          <AuthRoute path={`${langUrl}/item`} lazy={ItemTable} />

          <AuthRoute path={`${langUrl}/admin/form/:id`} lazy={AdminForm} />
          <AuthRoute path={`${langUrl}/admin/form`} lazy={AdminForm} />
          <AuthRoute path={`${langUrl}/admin`} lazy={AdminTable} />
          <AuthRoute
            path={`${langUrl}/site-info/form/:id`}
            lazy={SiteInfoForm}
          />
          <AuthRoute path={`${langUrl}/site-info`} lazy={SiteInfoTable} />
          <AuthRoute path={`${langUrl}`} lazy={Home} />
        </Switch>

        <ToastContainer style={{ zIndex: 99999 }} />
        <ScrollTopButton />
        <Dialog />
      </>
    );
  } else {
    return <h3>Loading...</h3>;
  }
}
