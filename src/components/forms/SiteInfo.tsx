import React from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { Store } from "../../Store";
import { IForm, IFormField, IState } from "../../interfaces";
import t from "../../utils/translation";

import Form from "../common/Form";

export default function SiteInfo() {
  const { dispatch } = React.useContext(Store);
  const dispatchType = "siteInfoForm";

  const nav: IState["nav"] = {
    title: "Site info - Edit",
    links: [{ name: "Site info" }, { name: "Edit" }],
  };

  const history = useHistory();
  const respHandler = {
    200: (): void => {
      history.goBack();
      dispatch({
        type: "delete",
        payload: dispatchType,
      });
      toast.success(t("Updated successfully"));
    },
  };

  const fields: Array<IFormField> = [
    {
      name: "name_",
      label: "Name",
      schema: "required",
      className: "col-sm-4",
    },
  ];

  const formData: IForm = {
    dispatchType,
    fields,
    respHandler,
    nav,
    access: "site-info",
    csrfProtected: true,
  };

  return <Form {...formData} />;
}
