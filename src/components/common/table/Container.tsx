import React from "react";
import { Link, useHistory } from "react-router-dom";
import queryString from "query-string";

import { Store } from "../../../Store";
import {
  TObject,
  ITable,
  ITableSearch,
  TOption,
  TDispatchType,
  FDispatchTableSearchForm,
} from "../../../interfaces";
import validation from "../../../utils/validation";
import { getLangUrl, isInt } from "../../../utils/common";
import auth from "../../../utils/auth";
import t from "../../../utils/translation";

import http from "../../../utils/http";
import { toast } from "react-toastify";
import TableSearch from "./Search";
import TableHead from "./Head";
import TableBody from "./Body";
import TablePagination from "./Pagination";

export default function Container({
  dispatchType: dispatchTypeP,
  fields: fieldsP,
  searches: searchesP,
  access: accessP,
  nav: navP,
  uniqueKey: uniqueKeyP,
  canUpload: canUploadP,
  setExtraState: setExtraStateP,
}: ITable): JSX.Element {
  const { state, dispatch } = React.useContext(Store);
  const { languageArr: languageArrS } = state;
  const tableS = state[dispatchTypeP] || {};
  const searchType = FDispatchTableSearchForm(dispatchTypeP);
  const searchS = state[searchType] || {};
  const langUrl = getLangUrl();
  const history = useHistory();

  React.useEffect(() => {
    if (navP) {
      dispatch({
        type: "nav",
        payload: navP,
      });
    }

    initState();

    return (): void => {
      dispatch({
        type: "delete",
        payload: dispatchTypeP,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateState = () => {
    dispatch({
      type: dispatchTypeP,
      payload: tableS,
    });
  };

  const updateSearch = () => {
    if (searchesP) {
      dispatch({
        type: searchType,
        payload: searchS,
      });
    }
  };

  const initState = () => {
    setState();
  };

  const setState = async (): Promise<void> => {
    dispatch({ type: "dialogMask" });

    const { data, status } = await http.get(
      `${accessP}${history.location.search}`
    );

    dispatch({ type: "dialogClose" });

    if (status === 401) {
      handleLoginDialog();
    } else if (status === 200) {
      if (data) {
        tableS.data = data;
      } else {
        if (searchS.page !== 1) {
          goTo(1);
          return;
        } else {
          delete tableS.data;
        }
      }

      const query = queryString.parse(history.location.search);
      if (!validateQuery(query)) {
        history.replace(langUrl);
      }

      setSearchS(searchesP, query);
      setPageS(query);

      delete tableS.sort;
      updateState();

      if (typeof setExtraStateP === "function") {
        setExtraStateP(tableS);
      }
    } else {
      toast.error(data.Msg);
    }
  };

  const handleLoginDialog = (): void => {
    dispatch({
      type: "dialog",
      payload: {
        show: true,
        type: "loginForm",
        callBack: initState,
      },
    });
  };

  const validateQuery = (query: TObject): boolean => {
    if (Object.keys(query).length !== 0) {
      if (query.page && !isInt(query.page)) {
        return false;
      }
    }
    return true;
  };

  const getQueryStringByState = (): string => {
    const query: TObject = {};

    if (searchS.data) {
      for (const key in searchS.data) {
        if (searchS.data[key]) {
          query[key] = searchS.data[key];
        }
      }
    }

    if (searchS.page && searchS.page !== 1) {
      query.page = searchS.page;
    }

    const qyStr = queryString.stringify(query);
    return `${qyStr ? `?${qyStr}` : ""}`;
  };

  const goTo = (page: number): void => {
    searchS.page = page;
    updateSearch();

    history.replace(`${langUrl}/${accessP}${getQueryStringByState()}`);
    initState();
  };

  const setSearchS = (searches: Array<ITableSearch>, query: TObject): void => {
    searchS.data = searchS.data || {};
    if (searches) {
      searches.forEach((search: ITableSearch) => {
        if (search.type === "select") {
          if (query[search.name] && search.options) {
            for (const opt of search.options) {
              if (String(opt.value) === query[search.name]) {
                searchS.data[search.name] = opt.value;
                break;
              }
            }
          } else if (search.default && search.options) {
            if (
              search.options.find(
                (opt: TOption) => search.default === opt.value
              )
            ) {
              searchS.data[search.name] = search.default;
            }
          }
        } else {
          if (query[search.name]) {
            searchS.data[search.name] = query[search.name];
          }
        }
      });
    }

    searchS.lock = true;
  };

  const setPageS = (query: TObject): void => {
    searchS.page = query.page || 1;
    updateSearch();
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (!tableS.submitting && tableS.sort) {
      if (accessP) {
        tableS.submitting = true;
      }

      updateState();

      const errors = validation.validateArr(tableS.data, fieldsP, languageArrS);
      if (Object.keys(errors).length === 0) {
        doSubmit();
      } else {
        toast.error("Sorting error");
        delete tableS.submitting;
        updateState();
      }
    }
  };

  const getPayload = (): Array<TObject> => {
    const payload: Array<TObject> = [];
    tableS.sort = tableS.sort || [];
    for (const id of tableS.sort) {
      const tmp = tableS.data.filter(
        (current: TObject) => current.id === id
      )[0];
      if (tmp) {
        payload.push({ id, sort: Number(tmp.sort) });
      }
    }
    return payload;
  };

  const doSubmit = async () => {
    const config: TObject = http.defaultConfig;
    const csrf = await http.getCsrfToken();
    http.handleCsrf(csrf, config);

    const { data, status } = await http.post(
      `${accessP}/multi-sort`,
      getPayload(),
      config
    );

    if (status === 401) {
      handleLoginDialog();
    } else if (status === 200) {
      toast.success(t("Updated successfully"));
      delete tableS.sort;
      delete tableS.submitting;
      updateState();
    } else {
      toast.error(t(data.Msg));
    }
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      {searchesP && (
        <>
          <TableSearch
            dispatchType={dispatchTypeP}
            updateState={updateState}
            searches={searchesP}
            tableS={tableS}
            goTo={goTo}
          />
          <div className="clearfix" />
          <hr />
        </>
      )}

      {(auth.check(accessP, 1) || auth.check(accessP, 4)) && (
        <>
          <div className="btn-group float-right">
            {auth.check(accessP, 1) && (
              <Link
                to={`${langUrl}/${accessP}/form`}
                className="btn btn-primary btn-sm mr-3"
              >
                {t("Create")}
              </Link>
            )}

            {auth.check(accessP, 4) &&
              fieldsP.find((field: TObject) => field.name === "sort") && (
                <button
                  type="submit"
                  className="btn btn-warning btn-sm"
                  disabled={tableS.submitting || !tableS.sort}
                >
                  {t("Update sort")}
                </button>
              )}
          </div>
          <div className="clearfix mb-2" />
        </>
      )}

      <div className="table-container">
        <table className="table table-bordered">
          <TableHead fields={fieldsP} />
          {tableS.data && (
            <TableBody
              fields={fieldsP}
              updateState={updateState}
              access={accessP}
              canUpload={canUploadP}
              langUrl={langUrl}
              handleLoginDialog={handleLoginDialog}
              tableS={tableS}
              uniqueKey={uniqueKeyP || "id"}
              initState={initState}
            />
          )}
        </table>
      </div>
      <div className="clearfix mb-3" />

      {tableS.data && (
        <div className="row justify-content-center">
          <TablePagination searchS={searchS} tableS={tableS} goTo={goTo} />
        </div>
      )}
    </form>
  );
}
