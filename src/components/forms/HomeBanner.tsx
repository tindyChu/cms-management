import React from "react";
import { useParams } from "react-router-dom";

import { IForm, IFormField, IState, TObject } from "../../interfaces";

import Form from "../common/Form";

export default function HomeBanner() {
  const dispatchType = "homeBannerForm";

  const nav: IState["nav"] = { title: "Home banner - " };

  const params: TObject = useParams();
  if (params.id) {
    nav.title = nav.title + "Edit";
    nav.links = [{ name: "Home banner", to: "/home-banner" }, { name: "Edit" }];
  } else {
    nav.title = nav.title + "Create";
    nav.links = [
      { name: "Home banner", to: "/home-banner" },
      { name: "Create" },
    ];
  }

  const fields: Array<IFormField> = [
    {
      name: "photo",
      label: "Choose a image",
      type: "file",
      schema: "mime[image/jpeg|image/jpg|image/png];maxSize[41943040]",
    },
    {
      name: "sort",
      label: "Sort",
      type: "number",
      default: 99,
      schema: "int;greaterEqual[1];required",
      className: "col-md-2 col-sm-3",
      min: 1,
    },
    {
      name: "desc_",
      label: "Description",
    },
  ];

  const formData: IForm = {
    dispatchType,
    fields,
    nav,
    access: "home-banner",
    csrfProtected: true,
  };

  return <Form {...formData} />;
}
