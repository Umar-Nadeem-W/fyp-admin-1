import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Collapse
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  Groups2Outlined,
  AssignmentOutlined,
  BarChart,
  Campaign,
  Report,
  Sms,
  AccountCircleOutlined,
  WavesOutlined,
  CropLandscape,
} from "@mui/icons-material";

import { FlexBetween } from ".";
// Nav items
const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Farms",
    icon: <WavesOutlined />,
  },
  
  {
    text: "Workers",
    icon: <Groups2Outlined />,
  },
  {
    text: "Tasks",
    icon: <AssignmentOutlined/>,
  },

];

// Sidebar
const Sidebar = ({

  user,
  isNonMobile,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  // config
  const [openDropdowns, setOpenDropdowns] = useState({});
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const toggleDropdown = (menu) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };
  // set active path
  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        // Sidebar
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
            "& .MuiDrawer-paper::-webkit-scrollbar": {
              width: 0,
            },
          }}
        >

            {/* Brand Info */}
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    onClick={() => {
                      navigate("/dashboard");
                      setActive("dashboard");
                    }}
                    sx={{
                      cursor: "pointer",
                    }}
                    title="MACHIRO"
                  >
                    Machiro
                  </Typography>
                </Box>
                {/* Mobile Sidebar Toggle Icon */}
                {!isNonMobile && (
                  <IconButton
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title="Close Sidebar"
                  >
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            
            {/* Sidebar items */}
            <List>
  {navItems.map(({ text, icon, children }) => {
    const lcText = text.toLowerCase();

    if (children) {
      return (
        <Box key={text}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => toggleDropdown(lcText)}>
              <ListItemIcon sx={{ ml: "2rem", color: theme.palette.secondary[200] }}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
              {openDropdowns[lcText] ? <ChevronLeft /> : <ChevronRightOutlined />}
            </ListItemButton>
          </ListItem>

          <Collapse in={openDropdowns[lcText]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {children.map((child) => {
                const childPath = child.path;
                return (
                  <ListItem key={child.text} disablePadding sx={{ pl: 4 }}>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${childPath}`);
                        setActive(childPath);
                      }}
                      sx={{
                        backgroundColor:
                          active === childPath
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === childPath
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemText primary={child.text} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItem key={text} disablePadding>
        <ListItemButton
          onClick={() => {
            navigate(`/${lcText}`);
            setActive(lcText);
          }}
          sx={{
            backgroundColor:
              active === lcText
                ? theme.palette.secondary[300]
                : "transparent",
            color:
              active === lcText
                ? theme.palette.primary[600]
                : theme.palette.secondary[100],
          }}
        >
          <ListItemIcon
            sx={{
              ml: "2rem",
              color:
                active === lcText
                  ? theme.palette.primary[600]
                  : theme.palette.secondary[200],
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} />
          {active === lcText && <ChevronRightOutlined sx={{ ml: "auto" }} />}
        </ListItemButton>
      </ListItem>
    );
  })}
</List>

          {/* User */}
          <Box pb="1rem">
            <Divider />
            <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
              <Box
                component="img"
                alt="profile"
                src={""}
                height="40px"
                width="40px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.9rem"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontSize="0.8rem"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              <SettingsOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </FlexBetween>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
