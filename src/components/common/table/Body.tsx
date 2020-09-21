import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Store } from "../../../Store";
import { TObject } from "../../../interfaces";
import { getDataSet } from "../../../utils/common";
import auth from "../../../utils/auth";
import http from "../../../utils/http";
import t from "../../../utils/translation";

export default function Body({
  fields: fieldsP,
  updateState: updateStateP,
  access: accessP,
  langUrl: langUrlP,
  handleLoginDialog: handleLoginDialogP,
  uniqueKey: uniqueKeyP,
  canUpload: canUploadP,
  initState: initStateP,
  tableS,
}: TObject): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const { languageArr: languageArrS } = state;

  const handleResp = (resp: TObject, handle200: () => void) => {
    if (resp.status === 401) {
      handleLoginDialogP();
    } else if (resp.status === 200) {
      handle200();
    } else {
      toast.error(t(resp.data.Msg));
    }
  };

  const handleVisibility = async (id: number | string): Promise<void> => {
    dispatch({ type: "dialogMask" });

    const config: TObject = http.defaultConfig;
    const csrf = await http.getCsrfToken();
    http.handleCsrf(csrf, config);

    const resp = await http.delete(
      `${accessP}/${id}?action=visibility`,
      config
    );

    dispatch({ type: "dialogClose" });

    const handle200 = () => {
      toast.success(t("Updated successfully"));
      tableS.data = tableS.data.map((current: TObject) => {
        if (current[uniqueKeyP] === id) {
          current.hidden = !current.hidden;
        }
        return current;
      });
      updateStateP();
    };
    handleResp(resp, handle200);
  };

  const handleDelete = (id: number | string): void => {
    dispatch({
      type: "dialog",
      payload: {
        show: true,
        type: "confirm",
        title: "Do you confirm to delete this data?",
        onConfirm: () => doDelete(id),
      },
    });
  };

  const doDelete = async (id: number | string): Promise<void> => {
    dispatch({ type: "dialogMask" });

    const config: TObject = http.defaultConfig;
    const csrf = await http.getCsrfToken();
    http.handleCsrf(csrf, config);

    const resp = await http.delete(`${accessP}/${id}`, config);

    dispatch({ type: "dialogClose" });

    const handle200 = () => {
      toast.success(t("Deleted successfully"));
      initStateP();
    };
    handleResp(resp, handle200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const input = e.currentTarget;
    tableS.sort = tableS.sort || [];
    tableS.data = tableS.data.map((current: TObject) => {
      if (String(current[uniqueKeyP]) === getDataSet(e).id) {
        current.sort = input.value;
        if (tableS.sort.indexOf(current[uniqueKeyP]) === -1) {
          // record for "update sort" button, will be clear if updated sort
          tableS.sort.push(current[uniqueKeyP]);
        }
      }
      return current;
    });

    updateStateP();
  };

  const getValue = (field: TObject, current: TObject): string => {
    if (field.replace !== undefined) {
      if (field.replace.arr.length > 0) {
        return field.replace.arr.filter(
          (rp: TObject) => rp[field.replace.filterKey] === current[field.name]
        )[0][field.replace.key];
      } else {
        return "";
      }
    }
    return current[field.name];
  };

  return (
    <tbody>
      {tableS.data &&
        tableS.data.map((current: TObject, index: number) => {
          return (
            <tr key={index}>
              {fieldsP.map((field: TObject) => {
                const className = field.className ? field.className : "";
                if (field.name.slice(-1) === "_") {
                  // multi lang field
                  return languageArrS.map((language) => {
                    const name = field.name + language.code;
                    return (
                      <td
                        className={className}
                        key={index + name + Math.random()}
                      >
                        {current[name]}
                      </td>
                    );
                  });
                } else {
                  // single lang field
                  return (
                    <td className={className} key={index + field.name}>
                      {field.name === "sort" ? (
                        <input
                          type="number"
                          min="1"
                          data-id={current[uniqueKeyP]}
                          className={className}
                          value={current.sort}
                          onChange={handleChange}
                        />
                      ) : (
                        getValue(field, current)
                      )}
                    </td>
                  );
                }
              })}
              <td>
                {auth.check(accessP, 4) && (
                  <>
                    <Link
                      className="btn btn-primary btn-sm"
                      title={t("Edit")}
                      to={`${langUrlP}/${accessP}/form/${current[uniqueKeyP]}`}
                    >
                      <i className="fas fa-edit" />
                    </Link>
                    &nbsp;
                    {canUploadP && (
                      <>
                        <Link
                          title={t("Edit files")}
                          className="btn btn-info btn-sm"
                          to={`${langUrlP}/${accessP}/file/${current[uniqueKeyP]}`}
                        >
                          <i className="fas fa-paperclip" />
                        </Link>
                        &nbsp;
                      </>
                    )}
                  </>
                )}
                {auth.check(accessP, 8) && (
                  <>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      title={t(current.hidden ? "Hidden" : "Visible")}
                      onClick={() => handleVisibility(current[uniqueKeyP])}
                    >
                      <i
                        className={`far fa-eye${
                          current.hidden ? "-slash" : ""
                        }`}
                      />
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      title={t("Delete")}
                      onClick={() => handleDelete(current[uniqueKeyP])}
                    >
                      {/* eye-slash */}
                      <i className="fa fa-trash-alt" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          );
        })}
    </tbody>
  );
}
