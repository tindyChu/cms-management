import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { Store } from "../../Store";
import { IFileForm, IFormField, TObject, TRespHandler } from "../../interfaces";
import Loading from "./Loading";
import FieldFile from "./field/File";
import FieldInput from "./field/Input";
import FieldRadio from "./field/Radio";
import validation from "../../utils/validation";
import t from "../../utils/translation";
import { isDuplicatedArr, getLangUrl, getPayload } from "../../utils/common";
import http from "../../utils/http";
import useResp from "../../hooks/useResp";

import "../../style/form.scss";

export default function FormFile({
  dispatchType: dispatchTypeP,
  fields: fieldsP,
  access: accessP,
  nav: navP,
  backButton: backButtonP,
  separatedUpload: separatedUploadP,
  csrfProtected: csrfProtectedP,
  ...restP
}: IFileForm): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const { languageArr: languageArrS } = state;

  const formS = state[dispatchTypeP] || {};
  formS.data = formS.data || [];

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

    return removeState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeState = (): void => {
    http.get(`${accessP}/${params.id}?action=unlock`);
    dispatch({
      type: "delete",
      payload: dispatchTypeP,
    });
  };

  const initState = () => {
    setState();
  };

  const setState = async (): Promise<void> => {
    dispatch({ type: "dialogMask" });

    const { data, status } = await http.get(
      `${accessP}/${params.id}?action=lock`
    );

    dispatch({ type: "dialogClose" });

    if (status === 401) {
      dispatch({
        type: "dialog",
        payload: {
          show: true,
          type: "loginForm",
          callBack: setState,
        },
      });
    } else if (status === 200) {
      formS.data = data;
      addBox();

      updateState();
    } else {
      toast.error(t(data.Msg));
      history.push(`${getLangUrl()}/${accessP}`);
    }
  };

  const updateState = () => {
    dispatch({ type: dispatchTypeP, payload: formS });
  };

  const modifyState = (i: number): void => {
    for (const name in formS.data) {
      if (typeof formS.data[i][name] === "string") {
        formS.data[i][name] = formS.data[i][name].trim();
      }
    }
  };

  const getFieldData = ({
    i,
    name,
    label,
    deepPath,
  }: IFormField): Array<TObject> => {
    let r: Array<TObject> = [];
    if (name.slice(-1) === "_") {
      //gen different lang field
      r = languageArrS.map((language) => {
        const nameLang = name + language.code;
        const r: TObject = {
          lang: language.code,
          name: nameLang,
          inputID: `${dispatchTypeP}_${nameLang}_${i}`,
        };
        if (label) {
          r.label = `${t(label)}(${language.name})`;
        }
        if (deepPath) {
          r.deepPath = `${deepPath}.${language.name}`;
        }

        return r;
      });
    } else {
      r = [
        {
          name,
          inputID: `${dispatchTypeP}_${name}_${i}`,
          label,
          deepPath,
        },
      ];
    }

    return r;
  };

  const renderField = ({
    i,
    deepPath,
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

    const fieldData = getFieldData({ i, name, label, deepPath });

    const edited = () => {
      if (formS.data[i].id) {
        formS.edited = formS.edited || [];
        formS.edited[i] = true;
      }
    };

    const input = fieldData.map((current) => {
      const deepPath = i.toString();
      let r;
      if (type === "select") {
        //FieldSelect
      } else if (type === "file") {
        const respHandler: TRespHandler = {
          "200": (data) => {
            toast.success(t("Uploaded successfully"));
            formS.data[i] = data;
            addBox();
            updateState();
          },
        };
        r = (
          <FieldFile
            key={current.inputID}
            dispatchType={dispatchTypeP}
            fields={fieldsP}
            name={current.name}
            deepPath={deepPath}
            access={accessP}
            separatedUpload={{ respHandler, ...separatedUploadP, deepPath }}
          />
        );
      } else if (type === "radio") {
        const handelClick = (e: React.ChangeEvent<HTMLInputElement>): void => {
          e.preventDefault();
          console.log("click");
          edited();
          const input = e.currentTarget;
          formS.data[i][input.name] = input.value;
          dispatch({ type: dispatchTypeP, payload: formS });
        };

        r = (
          <FieldRadio
            key={current.inputID}
            dispatchType={dispatchTypeP}
            fields={fieldsP}
            name={name}
            lang={current.lang}
            type={type}
            label={current.label}
            className={className}
            options={fieldRest.options}
            deepPath={deepPath}
            handelClick={handelClick}
            {...fieldRest}
          />
        );
      } else {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
          const input = e.currentTarget;
          edited();
          formS.data[i] = formS.data[i] || {};
          formS.data[i][input.name] = input.value;
          validation.handleCertain(e, formS, fieldsP, deepPath);
          dispatch({ type: dispatchTypeP, payload: formS });
        };
        r = (
          <FieldInput
            key={current.inputID}
            dispatchType={dispatchTypeP}
            fields={fieldsP}
            name={current.name}
            lang={current.lang}
            type={type}
            label={current.label}
            className={className}
            deepPath={deepPath}
            handleChange={handleChange}
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

  const addBox = (): void => {
    const newBox = {
      sort: restP.defaultSort ? restP.defaultSort : 99,
      is_cover: false,
    };

    if (formS.data) {
      const maxQty = restP.maxQty ? restP.maxQty : 1;
      if (
        formS.data.length < maxQty &&
        JSON.stringify(formS.data[formS.data.length - 1]) !==
          JSON.stringify(newBox)
      ) {
        formS.data = [...formS.data, newBox];
      }
    } else {
      formS.data = [newBox];
    }
  };

  const validateSubmit = (
    i: number,
    callBack: (i: number) => Promise<void>
  ) => {
    formS.errors = formS.errors || [];
    const errors = validation.validateAll(formS.data[i], fieldsP, languageArrS);
    if (Object.keys(errors).length === 0) {
      callBack(i);
    } else {
      //error
      formS.errors[i] = errors;
      formS.submitting[i] = false;
      updateState();
    }
  };

  const releaseSubmit = (i: number): void => {
    formS.submitting[i] = false;
    updateState();
  };

  const handleUpdate = async (i: number): Promise<void> => {
    formS.submitting = formS.submitting || [];
    if (!formS.submitting[i]) {
      formS.submitting[i] = true;
      modifyState(i);
      updateState();

      validateSubmit(i, doUpdate);
    }
  };

  const { handleResp } = useResp();
  const doUpdate = async (i: number): Promise<void> => {
    const config: TObject = http.defaultConfig;

    if (csrfProtectedP) {
      const csrf = await http.getCsrfToken();
      http.handleCsrf(csrf, config);
    }

    const id = formS.data[i].id;
    const resp = await http.post(
      `${accessP}/update/${id}`,
      getPayload(formS.data[i], fieldsP, languageArrS),
      config
    );

    const respHandler: TRespHandler = {
      "200": () => {
        formS.edited[i] = false;
        window.location.reload(false);
        toast.success(t("Updated successfully"));
      },
    };
    handleResp(resp, respHandler, i);

    releaseSubmit(i);
  };

  const handleVisibility = async (i: number): Promise<void> => {
    formS.submitting = formS.submitting || [];
    formS.submitting[i] = true;
    updateState();

    const id = formS.data[i].id;

    const config: TObject = http.defaultConfig;

    const csrf = await http.getCsrfToken();
    http.handleCsrf(csrf, config);

    const resp = await http.delete(
      `${accessP}/${id}?action=visibility`,
      config
    );

    const respHandler = {
      "200": () => {
        formS.data = formS.data.map((current: TObject) => {
          if (current.id === id) {
            current.hidden = !current.hidden;
          }
          return current;
        });
        toast.success(t("Updated successfully"));
      },
    };
    handleResp(resp, respHandler, i);

    releaseSubmit(i);
  };

  const handleDelete = (i: number): void => {
    dispatch({
      type: "dialog",
      payload: {
        show: true,
        type: "confirm",
        title: "Do you confirm to delete this data?",
        onConfirm: () => doDelete(i),
      },
    });
  };

  const doDelete = async (i: number): Promise<void> => {
    formS.submitting = formS.submitting || [];
    formS.submitting[i] = true;
    updateState();

    const id = formS.data[i].id;

    const config: TObject = http.defaultConfig;

    const csrf = await http.getCsrfToken();
    http.handleCsrf(csrf, config);

    const resp = await http.delete(`${accessP}/${id}`, config);

    const respHandler: TRespHandler = {
      "200": () => {
        formS.data.splice(i, 1);
        if (formS.errors) {
          formS.errors.splice(i, 1);
        }
        if (formS.edited) {
          formS.edited.splice(i, 1);
        }
        addBox();
        toast.success(t("Deleted successfully"));
      },
    };
    handleResp(resp, respHandler, i);

    releaseSubmit(i);
  };

  const renderButton = (i: number): JSX.Element => {
    const certainData = formS.data[i];
    const isSubmitting = formS.submitting && formS.submitting[i];
    const canUpdate =
      formS.edited &&
      formS.edited[i] &&
      (!formS.submitting || !formS.submitting[i]);

    const r = (
      <>
        {isSubmitting ? (
          <Loading />
        ) : (
          certainData.id && (
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-warning mr-2"
                title={t(certainData.hidden ? "Hidden" : "Visible")}
                onClick={() => handleVisibility(i)}
              >
                <i
                  className={`far fa-eye${certainData.hidden ? "-slash" : ""}`}
                />
              </button>
              <button
                type="button"
                className="btn btn-danger mr-2"
                title={t("Delete")}
                onClick={() => handleDelete(i)}
              >
                <i className="fa fa-trash-alt" />
              </button>
              <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={() => handleUpdate(i)}
                disabled={!canUpdate}
              >
                {t("Update")}
              </button>
            </div>
          )
        )}
      </>
    );

    return (
      <div className="row" key={`action_${i}`}>
        <div className="col-md-12 form-group">{r}</div>
      </div>
    );
  };

  return (
    <form className={restP.className || "form-file"}>
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

      {formS.data.map((current: TObject, i: number) => (
        <div className="border-bottom mb-5" key={i}>
          {fieldsP.map((field: IFormField) => renderField({ i, ...field }))}
          {renderButton(i)}
        </div>
      ))}

      <div className="clearfix" />
    </form>
  );
}
