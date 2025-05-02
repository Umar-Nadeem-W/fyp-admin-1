import React, { useState, useEffect, useCallback } from "react";
import {
  Agriculture,
  Groups,
  Pool,
  Devices,
  Engineering,
  SetMeal,
  Business,
  Assignment,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { FlexBetween, Header, StatBox } from "components";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
axios.defaults.baseURL = API_BASE_URL;

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/dashboard");
      if (response.data) {
        setDashboardData(response.data.data);
      } else {
        throw new Error("No data received from server");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRetry = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleRetry} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box m="1.5rem 4rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Farm Management Insights" />
      </FlexBetween>

      {/* Stat Boxes */}
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="25px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreen ? undefined : "span 12",
          },
        }}
      >
        {/* 1. Farms */}
        <StatCard 
          onClick={() => navigate("/farm")}
          title="Total Farms"
          value={dashboardData?.totalFarms || 0}
          icon={<Agriculture sx={{ color: theme.palette.secondary[300], fontSize: "50px" }} />}
        />
        {/* 2. Workers */}
        <StatCard 
          onClick={() => navigate("/farmworkers")}
          title="Total Workers"
          value={dashboardData?.totalWorkers || 0}
          icon={<Groups sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
        />
        {/* 3. Ponds */}
        <StatCard 
          onClick={() => navigate("/ponds")}
          title="Total Ponds"
          value={dashboardData?.totalPonds || 0}
          icon={<Pool sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
        />
        {/* 4. Devices */}
        <StatCard 
          onClick={() => navigate("/viewdevice")}
          title="Devices Installed"
          value={dashboardData?.totalDevices || 0}
          icon={<Devices sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
        />
        {/* 5. Installations */}
        <StatCard 
          onClick={() => navigate("/installations")}
          title="Installations"
          value={dashboardData?.totalInstallations || 0}
          icon={<Engineering sx={{ color: theme.palette.secondary[300], fontSize: "30px" }} />}
        />
        {/* 6. Fish Stock */}
        <StatCard 
          onClick={() => navigate("/fish")}
          title="Fish Stock"
          value={dashboardData?.totalFish || 0}
          icon={<SetMeal sx={{ color: theme.palette.secondary[300], fontSize: "26px" }} />}
        />
        {/* 7. Employee Farms */}
        <StatCard 
          onClick={() => navigate("/employeefarms")}
          title="Employee Farms"
          value={dashboardData?.totalEmployeeFarms || 0}
          icon={<Business sx={{ color: theme.palette.secondary[300], fontSize: "30px" }} />}
        />
        {/* 8. Employee Service Plans */}
        <StatCard 
          onClick={() => navigate("/employeeserviceplans")}
          title="Employee Service Plans"
          value={dashboardData?.totalEmployeeServicePlans || 0}
          icon={<Assignment sx={{ color: theme.palette.secondary[300], fontSize: "30px" }} />}
        />
      </Box>
    </Box>
  );
};

const StatCard = ({ onClick, title, value, icon }) => {
  const theme = useTheme();
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        width: "110%",
        height: "100%",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.75rem",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          transform: "scale(1.02)",
        },
      }}
    >
      <StatBox
        title={title}
        value={value}
        icon={icon}
      />
    </Box>
  );
};

export default Dashboard;
