import { RoleEnum } from "@/src/ts/enums.js";

export type roleName =
  | RoleEnum.KBI
  | RoleEnum.ADMIN
  | RoleEnum.MANAGER
  | RoleEnum.USER
  | "KBI"
  | "ADMIN"
  | "MANAGER"
  | "USER";
