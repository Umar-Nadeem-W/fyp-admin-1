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
  WaterOutlined, // Icon for ponds
  Cloud, 
  DeviceHubOutlined, // Icon for devices
  BuildOutlined, // Icon for tools
  FileCopyOutlined, // Icon for reports
  AddTaskOutlined, // Icon for new task
  SubscriptionsOutlined, // Icon for subscriptions
  TrendingUpOutlined, // Icon for statistics
  InsightsOutlined, // Icon for insights
  DownloadOutlined, // Icon for installations
  TaskAltOutlined,
  Devices,
  Refresh,
  Phishing,
  // Replacing FishOutlined with EmojiNatureOutlined
  SetMealOutlined,
  ReportGmailerrorred,
  AddToQueue,
  Backup,
  Visibility, 
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
    icon: <Phishing />, // Represents farms with multiple ponds
    children: [
      { text: "View Farms", path: "farms", icon: <FileCopyOutlined /> },
      { text: "Add Farm", path: "farms/add-farm", icon: <AddTaskOutlined /> },
    ],
  },
  {
    text: "Workers",
    icon: <Groups2Outlined />, // Represents workers or teams
  },
  {
    text: "Tasks",
    icon: <AssignmentOutlined />,
    children: 
      [
      { text: "View Tasks", path: "tasks/view-tasks", icon: <TaskAltOutlined /> } ,
      { text: "Assign Tasks", path: "tasks/assign-task", icon: <AddTaskOutlined /> } // Represents task management
      ]
    },
  {
    text: "Ponds",
    icon: <WaterOutlined />,
    children:[
      { text: "View Ponds", path: "ponds/view-ponds", icon: <TaskAltOutlined /> } ,
      { text: "Add pond", path: "ponds/add-pond", icon: <AddTaskOutlined /> }
    ], // Represents aquaculture ponds
  },
  {
    text: "Devices",
    icon: <DeviceHubOutlined />,
    children :[
      { text: "View Devices", path: "devices/view-devices", icon: <Devices /> },
      { text: "Add Device", path: "devices/add-device", icon: <AddToQueue />}
    ] // Represents IoT devices or equipment
  },
  {
    text: "Alerts",
    icon : <ReportGmailerrorred/>
  },
  {
    text: "Installations",
    icon: <DownloadOutlined />,
    children:[
      { text: "View Installations", path: "installations/view-installations", icon: <Cloud /> }, 
      { text: "Add Installation", path: "installations/add-installation", icon: <Backup /> },

    ] // Represents installations or downloads
  },
  {
    text: "Tools",
    icon: <BuildOutlined />, // Represents tools or utilities
    children: [
      { text: "Reports", path: "tools/reports", icon: <FileCopyOutlined /> }, // Updated route for reports
      { text: "New Task", path: "tools/new-task", icon: <AddTaskOutlined /> }, // Updated route for new task
    ],
  },
  {
    text: "Subscriptions",
    icon: <SubscriptionsOutlined />, // Represents subscription plans
  },
  {
    text: "Statistics",
    icon: <TrendingUpOutlined />, // Represents analytics or statistics
    children: [
      { text: "Farm Insights", path: "statistics/farm-insights", icon: <InsightsOutlined /> }, // Represents farm insights
      { text: "Employee Insights", path: "statistics/employee-insights", icon: <InsightsOutlined /> }, // Represents employee insights
    ],
  },
  {
    text: "Fish",
    icon: <SetMealOutlined />,
    children: [
      { text: "View Fish", path: "fish/view-fish", icon: <Visibility /> }, // Represents farm insights
      { text: "Add Fish Stock", path: "fish/add-fish", icon: <AddTaskOutlined /> }, // Represents employee insi
    ] // Replacing FishOutlined with EmojiNatureOutlined
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

  const renderNavItems = (items, parentKey = "", level = 0) => {
    return items.map(({ text, icon, children, path }) => {
      const lcText = text.toLowerCase();
      const key = parentKey ? `${parentKey}-${lcText}` : lcText;

      if (children) {
        return (
          <Box key={key}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => toggleDropdown(key)} sx={{ pl: 2 + level * 2 }}>
                <ListItemIcon sx={{ ml: "2rem", color: theme.palette.secondary[200] }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
                {openDropdowns[key] ? <ChevronLeft /> : <ChevronRightOutlined />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openDropdowns[key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderNavItems(children, key, level + 1)}
              </List>
            </Collapse>
          </Box>
        );
      }

      return (
        <ListItem key={key} disablePadding>
          <ListItemButton
            onClick={() => {
              navigate(`/${path || lcText}`);
              setActive(path || lcText);
            }}
            sx={{
              pl: 2 + level * 2, // Indentation based on level
              backgroundColor:
                active === (path || lcText)
                  ? theme.palette.secondary[300]
                  : "transparent",
              color:
                active === (path || lcText)
                  ? theme.palette.primary[600]
                  : theme.palette.secondary[100],
            }}
          >
            <ListItemIcon
              sx={{
                ml: "2rem",
                color:
                  active === (path || lcText)
                    ? theme.palette.primary[600]
                    : theme.palette.secondary[200],
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText primary={text} />
            {active === (path || lcText) && <ChevronRightOutlined sx={{ ml: "auto" }} />}
          </ListItemButton>
        </ListItem>
      );
    });
  };

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
          <List>{renderNavItems(navItems)}</List>

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
