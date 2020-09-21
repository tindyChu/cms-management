export type TObject = { [key: string]: any };
export type TLanguage = TObject;
export type TDispatch = (obj: IAction) => void;
export type TOption = { value: string; label: string };
export type TRespHandler = { [key: string]: (...args: any) => void };

export type TDispatchCommon =
  | "siteInfo"
  | "nav"
  | "languageArr"
  | "mgtRoleArr"
  | "dialog"
  | "tmpDialog"
  | "initialled"
  | "settingNav"
  | "leftNav"
  | "scrollTopButton"
  | "dialogLogin"
  | "dialogMask"
  | "dialogClose"
  | "delete";
export type TDispatchTable =
  | "homeBannerTable"
  | "itemTable"
  | "adminTable"
  | "siteInfoTable";
export type TDispatchForm =
  | "loginForm"
  | "homeBannerForm"
  | "itemForm"
  | "itemFileForm"
  | "adminForm"
  | "siteInfoForm";
export type TDispatchType = TDispatchCommon | TDispatchTable | TDispatchForm;

export type TNav = {
  title: string;
  links?: Array<{
    name: string;
    to?: string;
  }>;
};

export interface IState {
  siteInfo: TObject;
  nav: TNav;
  languageArr: Array<TLanguage>;
  mgtRoleArr?: Array<TObject>;
  initialled: boolean;
  settingNav: {
    show: boolean;
    expandLanguageArr: boolean;
    [key: string]: any;
  };
  leftNav: {
    expand: boolean;
    menu: {
      expandedArr: Array<string>;
    };
    [key: string]: any;
  };
  dialog: {
    show: boolean;
    component?: any;
    callBack?: (v?: any) => any;
    [key: string]: any;
  };
  scrollTopButton: {
    initialled: boolean;
    visibility: boolean;
  };
  [key: string]: any;
}

export interface IAction {
  type: TDispatchType;
  payload?: any;
}

export interface IContext {
  state: IState;
  dispatch: TDispatch;
}

export interface IForm {
  dispatchType: TDispatchForm;
  fields: Array<IFormField>;
  access: string;
  respHandler?: TRespHandler;
  nav?: TNav;
  className?: string;
  title?: string;
  submitButtonHtml?: string;
  backButton?: boolean;
  csrfProtected?: boolean;
  isViaDialog?: boolean;
  setExtraState?: (v: any) => any;
  [key: string]: any;
}

export interface IFormField {
  name: string;
  deepPath?: string;
  type?: string;
  schema?: string;
  label?: string;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
  options?: Array<TObject>;
  default?: string | number;
  [key: string]: any;
}

export interface ISearchForm {
  dispatchType: TDispatchTable;
  searches: Array<ITableSearch>;
  tableS: TObject;
  goTo: (page: number) => void;
  [key: string]: any;
}

export interface IInputField {
  dispatchType: TDispatchForm;
  fields: Array<IFormField>;
  name: string;
  deepPath: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lang?: string;
  label?: string;
  className?: string;
  [key: string]: any;
}
export interface ISelectField {
  dispatchType: TDispatchForm;
  name: string;
  deepPath: string;
  handleChange?: (opt: TObject) => void;
  label?: string;
  className?: string;
  options?: Array<TObject>;
}

export interface IFileForm {
  dispatchType: TDispatchForm;
  fields: Array<IFormField>;
  access: string;
  csrfProtected?: boolean;
  nav?: TNav;
  className?: string;
  title?: string;
  backButton?: boolean;
  separatedUpload?: TObject;
  [key: string]: any;
}

export interface IFileField {
  dispatchType: TDispatchType;
  fields: Array<IFormField>;
  name: string;
  deepPath: string;
  access?: string;
  label?: string;
  [key: string]: any;
}

export interface ITable {
  dispatchType: TDispatchTable;
  fields: Array<IFormField>;
  access: string;
  nav?: TNav;
  className?: string;
  title?: string;
  uniqueKey?: string;
  setExtraState?: (v?: any) => Promise<void>;
  [key: string]: any;
}

export interface ITableField {
  name: string;
  label: string;
  replace?: TObject;
  schema?: string;
  className?: string;
}

export interface ITableSearch {
  name: string;
  label: string;
  type?: string;
  schema?: string;
  className?: string;
  options?: Array<TOption>;
  default?: any;
}

export interface IError {
  dispatchType: TDispatchType;
  fieldName: string;
  deepPath: string;
}
