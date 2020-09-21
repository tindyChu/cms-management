import React from "react";

import { ITable, ITableField, ITableSearch } from "../../interfaces";
import Table from "../common/table/Container";

import "../../style/table.scss";

export default function Item() {
  const dispatchType = "itemTable";

  const fields: Array<ITableField> = [
    {
      name: "sort",
      label: "Sort",
      schema: "int;greaterEqual[1]",
      className: "sort",
    },
    {
      name: "name_",
      label: "Name_",
    },
    {
      name: "desc_",
      label: "Description_",
    },
  ];

  const searches: Array<ITableSearch> = [
    {
      name: "name",
      label: "Name",
    },
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
    canUpload: true,
    nav: {
      title: "Item",
      links: [{ name: "Item" }],
    },
    access: "item",
  };

  return <Table {...tableData} />;
}
