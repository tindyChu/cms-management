import React from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { Store } from "../../Store";
import { IForm, IFormField } from "../../interfaces";
import { getLangUrl, getStorage } from "../../utils/common";
import auth from "../../utils/auth";
import t from "../../utils/translation";

import { } from "module";
import Form from "../common/Form";

export default function Login(): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const dispatchType = "loginForm";

  const dialogS = state.dialog || {};
  const isViaDialog: boolean = dialogS.show && dialogS.type === dispatchType;
  const langUrl = getLangUrl();
  const history = useHistory();
  if (auth.isLogin() && !isViaDialog) {
    history.push(langUrl);
  }

  const loginFormS = state.loginForm || {};
  loginFormS.data = loginFormS.data || {};

  if (isViaDialog && !loginFormS.data.email) {
    const loginInfo = getStorage("LoginInfo");
    dispatch({
      type: dispatchType,
      payload: { ...loginFormS, data: { email: loginInfo && loginInfo.email } },
    });
  }

  const focusBack = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    setTimeout(function () {
      target.focus();
    }, 0);
  };

  const fields: Array<IFormField> = [
    {
      name: "email",
      label: "Email address",
      placeholder: "Email address",
      schema: "email;required",
      disabled: isViaDialog,
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "Password",
      schema: "required",
      autoFocus: isViaDialog,
      onBlur: isViaDialog ? focusBack : () => { },
    },
  ];

  const respHandler = {
    200: (data?: any): void => {
      if (data) {
        auth.saveStorage(data);
        if (isViaDialog) {
          dispatch({ type: "dialogClose" });
          if (typeof dialogS.callBack === "function") {
            dialogS.callBack(dialogS.callBack);
          }
        } else {
          history.replace(langUrl);
        }
        dispatch({
          type: "delete",
          payload: dispatchType,
        });
      }
    },
    else: (data?: any): void => {
      if (data) {
        toast.error(t(data.Msg));
      }

      if (loginFormS.data) {
        delete loginFormS.data.password;
      }
      delete loginFormS.submitting;
      dispatch({
        type: dispatchType,
        payload: loginFormS,
      });
    },
  };

  const formData: IForm = {
    dispatchType,
    fields,
    access: "admin/login",
    respHandler,
    className: "login-form",
    title: "Login to Your Account",
    submitButtonHtml: "Login",
    isViaDialog,
    backButton: false,
  };

  return (
    <section className="mt-5">
      <Form {...formData} />
    </section>
  );
}
