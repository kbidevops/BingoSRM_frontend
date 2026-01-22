import { HelpOutline, Folder, Logout } from "@mui/icons-material";
const basicManagementIcon = <Folder />;
const serviceManagement = <Folder />;
const missingIcon = <HelpOutline />;
const logoutIcon = <Logout />;

function NavbarIcon(id: string) {
  switch (id) {
    case "logout":
      return logoutIcon;
    case "user":
      return basicManagementIcon;
    case "sr":
      return serviceManagement;
    default:
      return missingIcon;
  }
}
export { NavbarIcon };
