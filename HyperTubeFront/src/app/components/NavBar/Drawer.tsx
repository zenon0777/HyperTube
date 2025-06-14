import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { getNavElements } from "@/app/data/NavBarElements";
import { MdMenu } from "react-icons/md";
import ProvidersMenu from "./ProviderMenu";
import LanguageSwitcher from "../LanguageSwitcher";
import SearchInput from "./SearchInput";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useDispatch } from "react-redux";
import { getUserProfile } from "@/app/store/userSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { useTranslations } from "next-intl";

export default function MenuDrawer() {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getUserProfile() as any);
  }, [dispatch]);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        text: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        {getNavElements(t).map((element) => (
          <ListItem
            key={element.name}
            disablePadding
            sx={{
              "&:hover": {
                backgroundColor: "#4b5563",
                color: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "1rem",
              },
            }}
          >
            <ListItemButton href={element.path}>
              <ListItemIcon
                sx={{
                  color: "#f97316",
                  size: "1.5rem",
                }}
              >
                {element.icon}
              </ListItemIcon>
              <ListItemText primary={element.name} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider
          sx={{
            backgroundColor: "#fff",
            color: "#fff",
            size: "0.001rem",
            margin: "0.5rem",
          }}
        />
        <ListItem
          key={"Providers"}
          disablePadding
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ProvidersMenu />
        </ListItem>
        <ListItem
          key={"Language"}
          disablePadding
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <LanguageSwitcher />
        </ListItem>
      </List>

      {!user.user ? (
        <List>
          <Divider
            sx={{
              backgroundColor: "#fff",
              color: "#fff",
              size: "0.001rem",
              margin: "0.5rem",
            }}
          />
          <ListItem
            key={"login"}
            sx={{
              "&:hover": {
                backgroundColor: "#4b5563",
                color: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-center",
                gap: "1rem",
              },
            }}
          >
            <ListItemButton
              href="/login"
              sx={{
                color: "#fff",
                bgcolor: "#f97316",
                size: "1rem",
                border: "1px solid #f97316",
                borderRadius: "9999px",
                paddingBottom: "0.5rem",
                paddingTop: "0.5rem",
                textAlign: "center",
                width: "90%",
              }}
            >
              <ListItemText primary={t("navBar.signIn")} />
            </ListItemButton>
          </ListItem>
          <ListItem
            key={"SignUp"}
            sx={{
              "&:hover": {
                backgroundColor: "#4b5563",
                color: "#f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-center",
                gap: "1rem",
              },
            }}
          >
            <ListItemButton
              href="/register"
              sx={{
                color: "#fff",
                bgcolor: "transparent",
                size: "1rem",
                border: "1px solid #fff",
                borderRadius: "9999px",
                paddingBottom: "0.5rem",
                paddingTop: "0.5rem",
                textAlign: "center",
                width: "90%",
              }}
            >
              <ListItemText primary={t("navBar.signUp")} />
            </ListItemButton>
          </ListItem>
        </List>) : (
        <div className="flex flex- items-center gap-2">
          <Button onClick={() => {
            authService.logout();
            setOpen(false);
            router.push("/login");
          }}
            sx={{
              color: "#fff",
              bgcolor: "#f97316",
              size: "1rem",
              border: "1px solid #f97316",
              borderRadius: "9999px",
              paddingBottom: "0.5rem",
              paddingTop: "0.5rem",
              textAlign: "center",
              width: "100%",
            }}
          >
            {t("navBar.logout")}
          </Button>
        </div>
      )}
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <MdMenu size={36} color="#f97316" />
      </Button>
      <Drawer
        open={open}
        anchor="right"
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#1f2937",
            color: "#fff",
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
