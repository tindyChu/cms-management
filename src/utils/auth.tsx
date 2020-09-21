import { TObject } from "../interfaces";
import { getStorage, setStorage } from "./common";

const removeStorage = (): void => {
  setStorage("PermissionArr", []);
  setStorage("LoginInfo", {});
};

const saveStorage = (data: TObject): void => {
  setStorage("PermissionArr", data.permission_arr || []);
  setStorage("LoginInfo", { hashId: data.hash_id, email: data.email });
};

export const isLogin = (): boolean => {
  const permissionArr = getStorage("PermissionArr");
  return permissionArr && permissionArr.length !== 0;
};

export const check = (access: string, ability: number): boolean => {
  // ability = [1: create, 2: read, 4: update, 8:delete]
  const permissionArr: Array<TObject> = getStorage("PermissionArr") || [];
  const permission = permissionArr.filter(
    (permission) => access === permission.access
  );

  return permission[0] && (permission[0].ability & ability) === ability;
};

export default {
  saveStorage: saveStorage,
  removeStorage,
  isLogin,
  check,
};
