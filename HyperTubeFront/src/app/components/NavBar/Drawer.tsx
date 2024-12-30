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
import { elements } from "@/app/data/NavBarElements";
import { MdMenu } from "react-icons/md";
import ProvidersMenu from "./ProviderMenu";

export default function MenuDrawer() {
  const [open, setOpen] = React.useState(false);

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
        {elements.map((element) => (
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
      </List>

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
            <ListItemText primary="Sign in" />
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
            <ListItemText primary="Sign up" />
          </ListItemButton>
        </ListItem>
      </List>
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
