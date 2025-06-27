import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { toast } from "react-toastify";

interface user {
  id: string;
  username: string;
  email: string;
  profile_picture: string;
}
export default function ProfileMenu(props: user) {
  const t = useTranslations();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    router.push('/profile');
  };

  const handleLogoutClick = async () => {
    handleClose();
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Profile settings">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "Profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar src={props.profile_picture} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="Profile-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >        <MenuItem onClick={handleProfileClick}>
          <Avatar /> {t("navBar.profile")}
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t("navBar.logout")}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
