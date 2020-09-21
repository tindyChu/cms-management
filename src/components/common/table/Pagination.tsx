import React from "react";
import ReactPaginate from "react-paginate";

import { TObject } from "../../../interfaces";

export default function Pagination({
  searchS,
  tableS,
  goTo: goToP,
}: TObject): JSX.Element | null {
  const handlePageChange = ({ selected }: TObject) => {
    goToP(selected + 1);
  };

  const forcePage = searchS.page ? searchS.page - 1 : 0;
  const totalRow = tableS.data[0].total_row;
  const perPage = tableS.data[0].per_page;
  const pageCount = Math.ceil(totalRow / perPage);

  if (pageCount && pageCount > 1) {
    return (
      <ReactPaginate
        forcePage={forcePage}
        pageCount={pageCount}
        marginPagesDisplayed={3}
        pageRangeDisplayed={3}
        previousLabel="&laquo;"
        nextLabel="&raquo;"
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        breakLinkClassName="page-link"
        activeClassName="page-item active"
        disabledClassName="page-item disabled"
        onPageChange={handlePageChange}
      />
    );
  } else {
    return null;
  }
}
