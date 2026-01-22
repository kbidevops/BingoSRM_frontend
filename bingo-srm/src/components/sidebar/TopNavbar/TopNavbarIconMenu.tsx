"use client";

import { useState } from "react";
import { Stack, IconButton, Avatar } from "@mui/material";
import ThemeSwitchButton from "@/src/components/sidebar/TopNavbar/ThemeSwitchButton";
import IconButtonLanguage from "@/src/components/sidebar/TopNavbar/TopNavbarIconMenuLanguage";
import UserProfileDialog from "@/src/components/sidebar/TopNavbar/UserProfileDialog";
import PersonIcon from "@mui/icons-material/Person";

function TopNavbarIconMenu() {
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  // const StyledBadge = styled(Badge)(({ theme }) => ({
  //     '& .MuiBadge-badge': {
  //         backgroundColor: theme.palette.error.main,
  //         color: theme.palette.warning.main,
  //         boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  //         '&::after': {
  //             position: 'absolute',
  //             top: 0,
  //             left: 0,
  //             width: '100%',
  //             height: '100%',
  //             borderRadius: '50%',
  //             animation: 'ripple 2s infinite ease-in-out',
  //             border: '1px solid currentColor',
  //             content: '""',
  //         },
  //     },
  //     '@keyframes ripple': {
  //         '0%': {
  //             transform: 'scale(.8)',
  //             opacity: 1,
  //         },
  //         '100%': {
  //             transform: 'scale(2.4)',
  //             opacity: 0,
  //         },
  //     },
  // }))

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <IconButton
          onClick={() => setOpenProfileDialog(true)}
          sx={{
            color: "text.primary",
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
              fontSize: "0.875rem",
            }}
          >
            <PersonIcon fontSize="small" />
          </Avatar>
        </IconButton>

        <IconButtonLanguage />

        <ThemeSwitchButton />

        {/*<IconButton>*/}
        {/*    <StyledBadge*/}
        {/*        overlap="circular"*/}
        {/*        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}*/}
        {/*        variant="dot"*/}
        {/*    >*/}
        {/*        <NotificationsRounded sx={{ color: 'white'}} />*/}
        {/*    </StyledBadge>*/}
        {/*</IconButton>*/}
      </Stack>

      <UserProfileDialog
        open={openProfileDialog}
        onClose={() => setOpenProfileDialog(false)}
      />
    </>
  );
}

export default TopNavbarIconMenu;
