import React from "react";

import { ITable, ITableField, ITableSearch } from "../../interfaces";
import Table from "../common/table/Container";

import "../../style/table.scss";

export default function HomeBanner() {
  const dispatchType = "homeBannerTable";

  const fields: Array<ITableField> = [
    {
      name: "sort",
      label: "Sort",
      schema: "int;greaterEqual[1]",
      className: "sort",
    },
    {
      name: "desc_",
      label: "Description_",
    },
  ];

  const searches: Array<ITableSearch> = [
    {
      name: "desc",
      label: "Description",
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
      title: "Home banner",
      links: [{ name: "Home banner" }],
    },
    access: "home-banner",
  };

  return <Table {...tableData} />;
}
