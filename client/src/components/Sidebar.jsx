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
  QuestionAnswer,
  Build,
  Water,
  Subscriptions,
  Task,
  Devices,
  Groups2Outlined,
  Downloading,
  Phishing,
  AddAlert,
  AccountCircleOutlined,
  WavesOutlined,
  CropLandscape,
} from "@mui/icons-material";

import { FlexBetween } from ".";
// Nav items
const adminNavItems = [
  { text: "Dashboard", icon: <HomeOutlined /> },
  {
    text: "Admin Tools",
    icon: <CropLandscape />,
    children: [
      { text: "AI Alert", path: "AI-alert" },
      { text: "Announcement", path: "announcements" },
    ],
  },
  {
    text: "Farms",
    icon: <WavesOutlined />,
    children: [
      { text: "Farm Owners", path: "farmsOwners" },
      { text: "All Farms", path: "all-farms" },
    ],
  },
  {
    text: "Employee",
    icon: <AccountCircleOutlined />,
    children: [
      { text: "Employee Info", path: "employee-info" },
      { text: "Add Employee", path: "add-employee" },
    ],
  },
  {
    text: "Service Plan",
    icon: <CropLandscape />,
    children: [
      { text: "List Plan", path: "list-plan" },
      { text: "Add Plan", path: "add-plan" },
    ],
  },
];

const farmOwnerNavItems = [
  {
    text: "FarmOwnerDashboard",
    icon: <HomeOutlined />,
  },
  {
    text: "Farms",
    icon: <WavesOutlined />,
    children: [
      { text: "Farms", path: "farm" },
    ],
  },
  {
    text: "FarmWorkers",
    icon: <Groups2Outlined />,
  },
  {
    text: "Tasks",
    icon: <Task />,
    children: [
      { text: "New Task", path: "newtask" },
    ],
  },
  {
    text: "Ponds",
    icon: <Water />,
    children: [
      { text: "Add Pond", path: "addpond" },
      { text: "View Pond", path: "ponds" },
    ],
  },
  {
    text: "Devices",
    icon: <Devices />,
    children: [
      { text: "Add Device", path: "adddevice" },
      { text: "View Device", path: "viewdevice" },
    ],
  },
  {
    text: "Tools",
    icon: <Build />,
    children: [
      { text: "New Task", path: "tools/new-task" },
      { text: "Reports", path: "toolsreport" },
    ]
  },
  {
    text: "Installations",
    icon: <Downloading />,
    children: [
      { text: "Add Installation", path: "addinstallations"},
      { text: "View Installation", path: "installations"}
    ]
  },
  {
    text: "Alerts",
    icon: <AddAlert />
  },
  {
    text: "Fish",
    icon: <Phishing />,
    children: [
      { text: "Add Fish", path: "addfish"},
      { text: "View Fish", path: "fish"}
    ]
  },
  {
    text: "Subscriptions",
    icon: <Subscriptions />,
    children: [
      { text: "Subscriptions", path: "subcriptionpage" },
    ],
  },
];

const employeenavItems = [
  {
    text: "employeeDashboard",
    icon: <HomeOutlined />,
    path: "employeedashboard"
  },
  {
    text: "EmployeeFarms",
    icon: <Phishing />, 
  },
  
  {
    text: "CustomerQueries",
    icon: <QuestionAnswer />,
    path: "customerqueries",
    },
  {
    text: "EmployeeServiceplans",
    icon: <QuestionAnswer />,
    path: "Employeeserviceplans"
  },
 
  {
    text: "EmployeeSubscriptions",
    icon: <Subscriptions />,
    path: "employeesubscriptions"
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

  const role = parseInt(localStorage.getItem("role")); 
  
  let navItems = [];
  if (role === 1) {
    navItems = adminNavItems;
  } else if (role === 4) {
    navItems = farmOwnerNavItems;
  } else if (role === 2) {
    navItems = employeenavItems;
  } else {
    navItems = []; 
  }

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
                      if (role === "admin") {
                        navigate("dashboard");
                        setActive("dashboard");
                      } else if (role === "farmOwner") {
                        navigate("farmOwnerdashboard");
                        setActive("farmOwnerdashboard");
                      } else if (role === "employee") {
                        navigate("employeedashboard");
                        setActive("employeedashboard");
                      }
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
