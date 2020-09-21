import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Store } from "../../../Store";
import { IFileField, TObject } from "../../../interfaces";
import { getPayload, getEndpoint } from "../../../utils/common";
import http from "../../../utils/http";
import deep from "../../../utils/deep";
import validation from "../../../utils/validation";
import t from "../../../utils/translation";
import Error from "./Error";
import Loading from "../Loading";
import useResp from "../../../hooks/useResp";

export default function File({
  dispatchType: dispatchTypeP,
  fields: fieldsP,
  name: nameP,
  label: labelP,
  deepPath: deepPathP,
  separatedUpload: separatedUploadP,
  access: accessP,
}: IFileField): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const { languageArr: languageArrS } = state;

  let formS = state[dispatchTypeP] || {};
  formS.data = formS.data || {};

  const dataDeepPath = `data${deepPathP ? `.${deepPathP}` : ""}`;
  const submitDeepPath = `submitting${deepPathP ? `.${deepPathP}` : ""}`;
  const errDeepPath = `errors${deepPathP ? `.${deepPathP}` : ""}`;

  const certainData = deep.get(dataDeepPath, formS);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      certainData[nameP] = certainData[nameP] || {};
      certainData[nameP].picked = e.target.files[0];
      validation.handleCertain(e, formS, fieldsP, deepPathP);
      dispatch({ type: dispatchTypeP, payload: formS });
    }
  };

  const handelSeparatedUpload = (): void => {
    if (certainData && !deep.get(submitDeepPath, formS)) {
      deep.set(submitDeepPath, formS, true);
      dispatch({ type: dispatchTypeP, payload: formS });

      const errors = validation.validateAll(certainData, fieldsP, languageArrS);
      if (Object.keys(errors).length === 0) {
        doSeparatedUpload();
      } else {
        //error
        deep.set(errDeepPath, formS, errors);
        deep.set(submitDeepPath, formS, false);
        dispatch({
          type: dispatchTypeP,
          payload: formS,
        });
      }
    }
  };

  const respHandler = {
    "200": (data: TObject): void => {
      toast.success(t("Uploaded successfully"));
      deep.set(dataDeepPath, formS, data);
      dispatch({ type: dispatchTypeP, payload: formS });
    },
  };

  const { handleResp } = useResp();
  const params: TObject = useParams();
  const doSeparatedUpload = async (): Promise<void> => {
    const config: TObject = http.defaultConfig;
    const csrf = await http.getCsrfToken();
    http.handleCsrf(csrf, config);
    config.headers["content-type"] = "multipart/form-data";

    const path = separatedUploadP.path || `${accessP}/${params.id}`;
    const resp = await http.post(
      path,
      getPayload(certainData, fieldsP, languageArrS),
      config
    );

    deep.set(submitDeepPath, formS, false);
    dispatch({ type: dispatchTypeP, payload: formS });

    handleResp(resp, separatedUploadP.respHandler || respHandler);
  };

  const id = `${deepPathP ? `${deepPathP}-` : ""}${nameP}`;
  const isError = deep.get(`${errDeepPath}.${nameP}`, formS);
  const isSubmitting = deep.get(submitDeepPath, formS);

  let view = <></>;
  if (certainData[nameP]) {
    if (certainData[nameP].picked) {
      if (!isError) {
        view = (
          <>
            <div className="col-sm-12 mb-2">
              <img
                className="preview"
                src={URL.createObjectURL(certainData[nameP].picked)}
                alt=""
              />
            </div>
          </>
        );
      }
    } else {
      view = (
        <div className="col-sm-12">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${getEndpoint()}${certainData.path}/${certainData[nameP]}`}
          >
            <img
              src={`${getEndpoint()}${certainData.path}/${
                certainData.thumb ? "thumb/" : ""
              }${certainData[nameP]}`}
              alt={certainData[nameP]}
            ></img>
          </a>
        </div>
      );
    }
  }

  let btnGroup = <></>;
  if (
    (certainData[nameP] && certainData[nameP].picked) ||
    !certainData[nameP]
  ) {
    btnGroup = (
      <>
        <div className="col-sm-12">
          <div className="btn-group">
            <label
              htmlFor={id}
              className={`file-label mr-2${isSubmitting ? " disabled" : ""}`}
            >
              <i className="fas fa-file" />
              &nbsp;{t(labelP || "Choose a file")}
            </label>
            {separatedUploadP &&
              (isSubmitting ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => handelSeparatedUpload()}
                  disabled={
                    isError || !certainData[nameP] || !certainData[nameP].picked
                  }
                >
                  <i className="fas fa-file-upload" />
                  &nbsp;{t("Upload")}
                </button>
              ))}
          </div>
        </div>
        <div className="col-sm-12">
          <input
            id={id}
            name={nameP}
            type="file"
            onChange={(e) => handleChangeFile(e)}
            className={`file-input${isError ? " is-invalid " : ""}`}
            disabled={isSubmitting}
          />
          {isError && (
            <Error
              dispatchType={dispatchTypeP}
              fieldName={nameP}
              deepPath={deepPathP}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <span key={id}>
      {view}
      {btnGroup}
    </span>
  );
}
