import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { Store } from "../../Store";
import { IForm, IFormField, TObject } from "../../interfaces";
import FieldInput from "./field/Input";
import FieldSelect from "./field/Select";
import FieldFile from "./field/File";

import { isDuplicatedArr, getLangUrl, getPayload } from "../../utils/common";
import http from "../../utils/http";
import validation from "../../utils/validation";
import t from "../../utils/translation";
import useResp from "../../hooks/useResp";

import "../../style/form.scss";

export default function Form({
  dispatchType: dispatchTypeP,
  fields: fieldsP,
  access: accessP,
  respHandler: respHandlerP,
  nav: navP,
  backButton: backButtonP,
  setExtraState: setExtraStateP,
  csrfProtected: csrfProtectedP,
  isViaDialog: isViaDialogP,
  ...restP
}: IForm): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const { languageArr: languageArrS, dialog: dialogS } = state;

  const formS = state[dispatchTypeP] || {};

  let isDataUndefined = false;
  if (!formS.data) {
    isDataUndefined = true;
    formS.data = {};
  }

  const params: TObject = useParams();
  const history: TObject = useHistory();
  React.useEffect(() => {
    if (isDuplicatedArr(fieldsP, "name")) {
      console.log("*** Warning: Field's 'name' duplicated ");
    }

    if (navP) {
      dispatch({
        type: "nav",
        payload: navP,
      });
    }

    initState();

    return (): void => {
      if (params.id) {
        http.get(`${accessP}/${params.id}?action=unlock`);
      }
      dispatch({
        type: "delete",
        payload: dispatchTypeP,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initState = () => {
    if (params.id) {
      if (isDataUndefined) {
        setState();
      }
    } else {
      setDefaultField();
      if (typeof setExtraStateP === "function") {
        setExtraStateP(formS);
      }
    }
  };

  const updateState = () => {
    dispatch({ type: dispatchTypeP, payload: formS });
  };

  const setDefaultField = () => {
    fieldsP.forEach((field) => {
      if (field.default) {
        if (field.name.slice(-1) === "_") {
          for (const language of languageArrS) {
            formS.data[field.name + language.code] = field.default;
          }
        } else {
          formS.data[field.name] = field.default;
        }
      }
    });
    updateState();
  };

  const handleLoginDialog = () => {
    if (dispatchTypeP === "loginForm") {
      if (dialogS.show === true) {
        //just re-render
        dispatch({
          type: "dialog",
          payload: dialogS,
        });
      }
    } else {
      dispatch({
        type: "dialog",
        payload: {
          show: true,
          type: "loginForm",
          callBack: initState,
        },
      });
    }
  };

  const setState = async (): Promise<void> => {
    dispatch({ type: "dialogMask" });

    const { data, status } = await http.get(
      `${accessP}/${params.id}?action=lock`
    );

    if (!isViaDialogP) {
      dispatch({ type: "dialogClose" });
    }

    if (status === 401) {
      handleLoginDialog();
    } else if (status === 200) {
      formS.data = data;
      updateState();

      if (typeof setExtraStateP === "function") {
        setExtraStateP(formS);
      }
    } else {
      toast.error(t(data.Msg));
      history.push(`${getLangUrl()}/${accessP}`);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!formS.submitting) {
      formS.submitting = true;

      modifyState();

      if (!isViaDialogP) {
        dispatch({ type: "dialogMask" });
      }

      const errors = validation.validateAll(formS.data, fieldsP, languageArrS);
      if (Object.keys(errors).length === 0) {
        doSubmit();
      } else {
        //invalid
        formS.errors = errors;
        delete formS.submitting;
        updateState();

        if (!isViaDialogP) {
          dispatch({ type: "dialogClose" });
        }
      }
    }
  };

  const modifyState = (): void => {
    for (const name in formS.data) {
      // Trim value unless 'password'
      if (typeof formS.data[name] === "string") {
        let origName = name;
        for (const language of languageArrS) {
          const lang = language.code;
          if (name.indexOf(`_${lang}`) !== -1) {
            origName = name.slice(0, -lang.length);
          }
        }

        const field = fieldsP.filter((field) => field.name === origName);
        if (field[0] && field[0].type !== "password") {
          formS.data[name] = formS.data[name].trim();
        }
      }
    }

    updateState();
  };

  const { handleResp } = useResp();
  const doSubmit = async (): Promise<void> => {
    const config: TObject = http.defaultConfig;
    if (csrfProtectedP) {
      const csrf = await http.getCsrfToken();
      http.handleCsrf(csrf, config);
    }

    let path: string;
    if (params.id) {
      path = `${accessP}/${params.id}`;
    } else {
      path = `${accessP}`;
    }

    if (fieldsP.filter((current) => current.type === "file")) {
      config.headers["content-type"] = "multipart/form-data";
    }

    const resp = await http.post(
      path,
      getPayload(formS.data, fieldsP, languageArrS),
      config
    );

    delete formS.submitting;
    updateState();

    if (!isViaDialogP) {
      dispatch({ type: "dialogClose" });
    }

    const respHandler = respHandlerP || {};
    if (!respHandler["200"]) {
      respHandler["200"] = (): void => {
        history.goBack();
        dispatch({
          type: "delete",
          payload: dispatchTypeP,
        });
        const msg = params.id ? "Updated successfully" : "Created successfully";
        toast.success(t(msg));
      };
    }
    handleResp(resp, respHandler);
  };

  const getFieldData = ({ name, label }: IFormField): Array<TObject> => {
    let r: Array<TObject> = [];
    if (name.slice(-1) === "_") {
      //gen different lang field
      r = languageArrS.map((language) => {
        const nameLang = name + language.code;
        const r: TObject = {
          lang: language.code,
          name: nameLang,
          inputID: `${dispatchTypeP}_${nameLang}`,
          isError: formS.errors && formS.errors[nameLang],
        };
        if (label) {
          r.label = `${t(label)}(${language.name})`;
        }

        return r;
      });
    } else {
      r = [
        {
          name,
          inputID: `${dispatchTypeP}_${name}`,
          isError: formS.errors && formS.errors[name],
          label,
        },
      ];
    }
    return r;
  };

  const renderField = ({
    name,
    type,
    label,
    schema,
    className,
    ...fieldRest
  }: IFormField): JSX.Element => {
    fieldRest.placeholder = fieldRest.placeholder
      ? t(fieldRest.placeholder)
      : "";

    const fieldData = getFieldData({ name, label });
    const input = fieldData.map((current) => {
      const id = current.inputID;
      let r;
      if (type === "select") {
        r = (
          <FieldSelect
            key={id}
            dispatchType={dispatchTypeP}
            name={current.name}
            label={current.label}
            className={className}
            options={fieldRest.options}
            deepPath=""
          />
        );
      } else if (type === "file") {
        r = (
          <FieldFile
            key={current.inputID}
            dispatchType={dispatchTypeP}
            fields={fieldsP}
            name={current.name}
            deepPath=""
            access={accessP}
          />
        );
      } else {
        r = (
          <FieldInput
            key={id}
            dispatchType={dispatchTypeP}
            fields={fieldsP}
            name={current.name}
            lang={current.lang}
            type={type}
            label={current.label}
            className={className}
            deepPath=""
            {...fieldRest}
          />
        );
      }

      return r;
    });

    return (
      <div className="row" key={`${dispatchTypeP}_${name}`}>
        {input}
      </div>
    );
  };

  // Call renderField as <RenderField /> will blur after onChange unless renderInput place outside "Form" function
  return (
    <form
      className={restP.className}
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      {backButtonP !== false && (
        <>
          <button
            type="button"
            className="back btn btn-secondary"
            onClick={history.goBack}
          >
            {`< ${t("Back")}`}
          </button>
          <div className="clearfix" />
        </>
      )}
      {restP.title && <p className="title">{t(restP.title)}</p>}

      {fieldsP.map((field: IFormField) => renderField(field))}
      <div className="clearfix" />

      <button disabled={formS.submitting} className="submit btn btn-primary">
        {t(restP.submitButtonHtml || "Submit")}
      </button>
      <div className="clearfix" />
    </form>
  );
}
