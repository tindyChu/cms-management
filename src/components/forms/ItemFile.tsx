import React from "react";

import { IFileForm, IFormField, IState } from "../../interfaces";

import FormFile from "../common/FormFile";

export default function ItemFile() {
  const nav: IState["nav"] = { title: "Item - " };
  nav.title = nav.title + "Edit files";
  nav.links = [{ name: "Item", to: "/item" }, { name: "Edit files" }];

  const fields: Array<IFormField> = [
    {
      name: "photo",
      label: "Choose a image",
      type: "file",
      schema: "mime[image/jpeg|image/jpg|image/png];maxSize[20971520]",
    },
    {
      name: "sort",
      label: "Sort",
      type: "number",
      // schema: "int;greaterEqual[99];required",
      className: "col-md-2 col-sm-3",
      min: 1,
    },
    {
      name: "is_cover",
      label: "Cover",
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
  ];

  const formData: IFileForm = {
    dispatchType: "itemFileForm",
    maxQty: 5,
    fields,
    nav,
    access: "item/file",
    separatedUpload: {},
    csrfProtected: true,
  };

  return <FormFile {...formData} />;
}
