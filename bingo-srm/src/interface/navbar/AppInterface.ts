import { roleName } from "@/src/ts/types";

/** state.app (AppSlice) **/
export interface IAppState {
  currentUser: ICurrentUser;
  drawerWidth: number;
  isLoading: boolean;
  isDrawerOpen: boolean;
  loggedInFlag: boolean;
}

/** state.navbar (AppSliceNavbar) **/
export interface ILoginResponse extends ICurrentUser {
  appGroups: INavbarAppGroup[];
  sessionTimeout: number;
  permission: string;
  targetOrganization: string;
  showLicenceAlert: boolean;
  licenceExpiredMsg: string | null;
  twoFactorAuthRequired: boolean;
}
export interface ICurrentUser {
  userId: string;
  username: string;
  roleList: { roleId: string; roleName: roleName }[];
  appLang: "kr" | "en";
  theme: "dark" | "light";
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}
export interface INavbarState {
  appGroups: INavbarAppGroup[];
}
export interface INavbarAppGroup {
  appGroupId: string;
  index: number;
  appGroupName: string;
  apps: INavbarApp[];
  createdDate: string;
  modifiedDate: string;
}

export interface INavbarApp extends INavbarRWX {
  appId: string;
  id: string;
  to: string;
  name: string;
  index: number;
  createdDate: string;
  modifiedDate: string;
  menus: INavbarMenu[];
}

export interface INavbarMenu extends INavbarRWX {
  menuId: string;
  id: string;
  to: string;
  name: string;
  index: number;
  createdDate: string;
  modifiedDate: string;
  subMenus: [] | null;
}
export interface INavbarRWX {
  read: boolean;
  write: boolean;
  execute: boolean;
}

// Error Page
export interface IError {
  message?: string;
  data: string;
  error: {
    message: string;
    stack: string;
  };
  internal: boolean;
  status: number;
  statusText: string;
}
export interface IErrorFromBackend {
  error: string;
  message: string;
}

// Login Page & Login Response
export interface ILoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCodeList?: number[];
}
