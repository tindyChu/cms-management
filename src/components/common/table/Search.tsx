import React from "react";

import { Store } from "../../../Store";
import {
  ISearchForm,
  TObject,
  FDispatchTableSearchForm,
} from "../../../interfaces";
import t from "../../../utils/translation";
import FieldInput from "../field/Input";
import FieldSelect from "../field/Select";

export default function Search({
  dispatchType: dispatchTypeP,
  searches: searchesP,
  tableS,
  goTo: goToP,
}: ISearchForm): JSX.Element {
  const { state, dispatch } = React.useContext(Store);

  const searchType = FDispatchTableSearchForm(dispatchTypeP);
  let searchS = state[searchType] || {};
  searchS.data = searchS.data || {};

  React.useEffect(() => {
    return (): void => {
      dispatch({
        type: "delete",
        payload: searchType,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (): void => {
    if (tableS.sort) {
      //if sort has been modified
      dispatch({
        type: "dialog",
        payload: {
          show: true,
          title: "Sorting has been modified",
          desc: "If continue searching, the new sort will not be updated",
          type: "confirm",
          confirmHtml: "Search",
          onConfirm: goToP(1),
        },
      });
    } else {
      goToP(1);
    }
  };

  const renderSearch = ({ current }: TObject): JSX.Element => {
    if (current.options) {
      current.options = current.options.map((option: TObject) => {
        return { ...option, label: t(option.label) };
      });
    }

    const id = `search-${current.name}`;
    let r = <></>;
    if (current.type === "select") {
      const handleChange = (opt: TObject): void => {
        searchS.data[current.name] = opt.value;
        delete searchS.lock;
        dispatch({ type: searchType, payload: searchS });
      };
      r = (
        <FieldSelect
          key={id}
          dispatchType={searchType}
          name={current.name}
          label={current.label}
          options={current.options}
          handleChange={handleChange}
          deepPath=""
        />
      );
    } else {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const input = e.currentTarget;
        searchS.data[input.name] = input.value;
        delete searchS.lock;
        dispatch({ type: searchType, payload: searchS });
      };
      r = (
        <FieldInput
          key={id}
          dispatchType={searchType}
          fields={searchesP}
          name={current.name}
          lang=""
          type={current.type}
          label={current.label}
          handleChange={handleChange}
          deepPath=""
        />
      );
    }

    return r;
  };

  return (
    <div className="table-search">
      <div className="row">
        {searchesP.map((current: TObject) => (
          <div
            key={`search-${current.name}`}
            className={`${current.className || "col-sm-4"} form-group`}
          >
            {renderSearch({ current })}
          </div>
        ))}
      </div>
      <div className="clearfix" />
      <div className="btn-gp float-right">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleSearch}
          disabled={searchS.lock}
        >
          {t("Search")}
        </button>
      </div>
    </div>
  );
}
