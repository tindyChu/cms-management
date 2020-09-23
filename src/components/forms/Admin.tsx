import React from "react";
import { useParams } from "react-router-dom";

import { Store } from "../../Store";
import { IForm, IFormField, TObject, IState, TOption } from "../../interfaces";
import Form from "../common/Form";
import { getStorage } from "../../utils/common";
import http from "../../utils/http";
import t from "../../utils/translation";

export default function Admin() {
  const { state, dispatch } = React.useContext(Store);
  const dispatchType = "adminForm";

  const formS = state[dispatchType] || {};
  const loginInfo = getStorage("LoginInfo");

  const params: TObject = useParams();
  const nav: IState["nav"] = { title: "Admin - " };
  if (params.id) {
    nav.title = nav.title + "Edit";
    nav.links = [{ name: "Admin", to: "/admin" }, { name: "Edit" }];
  } else {
    nav.title = nav.title + "Create";
    nav.links = [{ name: "Admin", to: "/admin" }, { name: "Create" }];
  }

  const setMgtRoleS = async (formS: TObject): Promise<void> => {
    const { data, status } = await http.get("mgt-role/under-own");

    if (status === 200) {
      formS.underMgtRoleArr = data;
      dispatch({
        type: dispatchType,
        payload: formS,
      });
    }
  };

  const getMgtRoleOptions = (data: Array<TObject>): Array<TOption> => {
    const r = data.map((current: TObject) => {
      return {
        value: current.id,
        label: current[`name_${getStorage("Lang")}`],
      };
    });
    return r;
  };

  const emailObj: IFormField = {
    name: "email",
    label: "Email address",
    className: "col-sm-6",
  };
  if (params.id) {
    emailObj.disabled = true;
  } else {
    emailObj.schema = "required;email";
  }

  const fields: Array<IFormField> = [
    emailObj,
    {
      name: "name_",
      label: "Name",
      className: "col-sm-4",
    },
  ];

  if (formS.underMgtRoleArr && (!params.id || params.id !== loginInfo.hashId)) {
    // create or not editing own
    fields.push({
      name: "mgt_role_id",
      label: "Role",
      type: "select",
      options: getMgtRoleOptions(formS.underMgtRoleArr),
      className: "col-sm-6",
    });
  }

  const pwObj: IFormField = {
    name: "password",
    label: "Password",
    type: "password",
    className: "border-top col-sm-6",
    schema: params.id ? "" : "required",
  };
  const confirmPwObj: IFormField = {
    name: "confirmed_password",
    label: "Confirmed password",
    className: "col-sm-6",
    type: "password",
    schema: "match[password]",
  };
  const bottomClass = "border-bottom col-sm-6";
  if (params.id) {
    if (params.id === loginInfo.hashId) {
      // editing own
      const ph = t("Leave blank if you don't want to change password");

      pwObj.placeholder = ph;
      fields.push(pwObj);

      confirmPwObj.placeholder = ph;
      fields.push(confirmPwObj);

      fields.push({
        name: "old_password",
        label: "Old password",
        type: "password",
        className: bottomClass,
        placeholder: ph,
      });
    }
  } else {
    // create
    confirmPwObj.className = bottomClass;
    fields.push(pwObj);
    fields.push(confirmPwObj);
  }

  const formData: IForm = {
    dispatchType,
    className: "admin-form",
    fields,
    nav,
    access: "admin",
    backButton: true,
    setExtraState: setMgtRoleS,
    csrfProtected: true,
  };

  return <Form {...formData} />;
}
