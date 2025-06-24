"use client";
import { useAPIProvider } from "@/app/hooks/useAPIProvider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import * as React from "react";
import { useTranslations } from "next-intl";
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.warning.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

export default function ProvidersMenu() {
  const t = useTranslations();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { changeProvider } = useAPIProvider();

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        color="warning"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          "&:hover": {
            backgroundColor: "#FB9722",
          },
          width: "full",
          height: "35px",
          borderRadius: "5px",
        }}
      >
        {t("navBar.providers")}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        sx={{
          "& .MuiMenu-list": {
            padding: 0,
            backgroundColor: "#1A202C",
            color: "#FB9722",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            borderRadius: "5px",
          },
          "& .MuiMenuItem-root": {
            "&:hover": {
              backgroundColor: "#FB9722",
            },
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          },
          "& .MuiDivider-root": {
            backgroundColor: "#fff",
            width: "90%",
            margin: "auto",
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          sx={{
            "&:hover": {
              backgroundColor: "#FB9722",
            },
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
          onClick={() => {
            changeProvider("YTS");
            handleClose();
          }}
          disableRipple
        >
          {t("navBar.providersYts")}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          sx={{
            "&:hover": {
              backgroundColor: "#FB9722",
            },
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
          onClick={() => {
            changeProvider("TMDB");
            handleClose();
          }}
          disableRipple
        >
          {t("navBar.providersTmdb")}
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
