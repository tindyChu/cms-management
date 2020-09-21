import React from "react";

import { ITable, ITableField } from "../../interfaces";
import Table from "../common/table/Container";

import "../../style/table.scss";

export default function SiteInfo() {
  const dispatchType = "siteInfoTable";

  const fields: Array<ITableField> = [
    {
      name: "name_",
      label: "Name_",
    },
  ];

  const tableData: ITable = {
    dispatchType,
    fields,
    nav: {
      title: "Site info",
      links: [{ name: "Site info" }],
    },
    access: "site-info",
  };

  return <Table {...tableData} />;
}
