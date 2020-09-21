import React from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import { Store } from "../../Store";
import {
  ITable,
  ITableField,
  ITableSearch,
  TObject,
  TOption,
  TDispatchTable,
} from "../../interfaces";
import Table from "../common/table/Container";

import http from "../../utils/http";
import { getStorage } from "../../utils/common";
import t from "../../utils/translation";

import "../../style/table.scss";

export default function Admin() {
  const { state, dispatch } = React.useContext(Store);
  const dispatchType: TDispatchTable = "adminTable";
  const mgtRoleArrS = state.mgtRoleArr || [];

  const history = useHistory();
  const setMgtRoleS = async (tableS: TObject): Promise<void> => {
    if (Object.keys(mgtRoleArrS).length === 0) {
      const { data, status } = await http.get("mgt-role");
      if (status === 200) {
        dispatch({
          type: "mgtRoleArr",
          payload: data,
        });

        setSearchMgtRoleS(data, tableS);
      }
    }
  };

  const setSearchMgtRoleS = (data: Array<TObject>, tableS: TObject) => {
    const query = queryString.parse(history.location.search);
    for (const opt of getMgtRoleOptions(data)) {
      if (String(opt.value) === query["mgt-role-id"]) {
        tableS.search = tableS.search || {};
        tableS.search["mgt-role-id"] = opt.value;
        dispatch({
          type: dispatchType,
          payload: tableS,
        });
        break;
      }
    }
  };

  const getMgtRoleOptions = (data: Array<TObject>): Array<TOption> => {
    const r = data.map((current: TObject) => {
      return {
        value: current.id,
        label: current[`name_${getStorage("Lang")}`],
      };
    });

    r.unshift({ value: "all", label: t("All") });
    return r;
  };

  const fields: Array<ITableField> = [
    {
      name: "email",
      label: "Email address",
    },
    {
      // name: ,
      name: `mgt_role_id`,
      label: `Role`,
      replace: {
        arr: mgtRoleArrS,
        filterKey: "id",
        key: `name_${getStorage("Lang")}`,
      },
    },
  ];

  const searches: Array<ITableSearch> = [
    {
      name: "email",
      label: "Email address",
    },
    {
      name: "mgt-role-id",
      label: "Role",
      type: "select",
      options: getMgtRoleOptions(mgtRoleArrS),
      default: "all",
      className: "col-md-3 col-sm-4",
    },
    {
      name: "visibility",
      label: "Visibility",
      type: "select",
      options: [
        { value: "all", label: "All" },
        { value: "true", label: "Visible" },
        { value: "false", label: "Hidden" },
      ],
      default: "all",
      className: "col-md-2 col-sm-3",
    },
  ];

  const tableData: ITable = {
    dispatchType,
    fields,
    searches,
    nav: {
      title: "Admin",
      links: [{ name: "Admin" }],
    },
    access: "admin",
    uniqueKey: "hash_id",
    setExtraState: setMgtRoleS,
  };

  return <Table {...tableData} />;
}
