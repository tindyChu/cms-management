import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Store } from "../../Store";
import { IForm, IFormField, TObject, IState } from "../../interfaces";
import { getLangUrl } from "../../utils/common";
import t from "../../utils/translation";
import Form from "../common/Form";

export default function Item() {
  const { dispatch } = React.useContext(Store);
  const dispatchType = "itemForm";

  const params: TObject = useParams();
  const nav: IState["nav"] = { title: "Item - " };

  if (params.id) {
    nav.title = nav.title + "Edit";
    nav.links = [{ name: "Item", to: "/item" }, { name: "Edit" }];
  } else {
    nav.title = nav.title + "Create";
    nav.links = [{ name: "Item", to: "/item" }, { name: "Create" }];
  }

  const history = useHistory();
  const respHandler = {
    "200": (data: TObject): void => {
      if (params.id) {
        history.goBack();
      } else {
        const langUrl = getLangUrl();
        history.replace(`${langUrl}/item/file/${data.id}`);
      }
      dispatch({
        type: "delete",
        payload: dispatchType,
      });
      const msg = params.id ? "Updated successfully" : "Created successfully";
      toast.success(t(msg));
    },
  };

  const fields: Array<IFormField> = [
    {
      name: "sort",
      label: "Sort",
      type: "number",
      default: 99,
      schema: "int;greaterEqual[1]",
      className: "col-md-2 col-sm-3",
    },
    {
      name: "name_",
      label: "Name",
      schema: "required",
      className: "col-sm-4",
    },
    {
      name: "desc_",
      label: "Description",
    },
  ];

  const formData: IForm = {
    dispatchType,
    fields,
    respHandler,
    nav,
    access: "item",
    csrfProtected: true,
  };

  return <Form {...formData} />;
}
