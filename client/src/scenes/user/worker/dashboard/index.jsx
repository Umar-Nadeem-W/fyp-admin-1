import React, { useState, useEffect, useCallback } from "react";
import {
  SettingsInputAntenna,
  Pool,
  Assignment,
  SetMeal,
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

const WorkerDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/worker/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setDashboardData(response.data.data);
      } else {
        throw new Error("No data received from server");
      }
    } catch (err) {
      console.error("Error fetching worker dashboard data:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch worker dashboard data");
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
        <Header title="WORKER DASHBOARD" subtitle="Overview of Pond Assignments and Activities" />
      </FlexBetween>

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
        {/* 1. Devices */}
        <StatCard 
          onClick={() => navigate("/workerdevices")}
          title="Total Devices"
          value={dashboardData?.totalDevices || 0}
          icon={<SettingsInputAntenna sx={{ color: theme.palette.secondary[300], fontSize: "30px" }} />}
        />

        {/* 2. Ponds */}
        <StatCard 
          onClick={() => navigate("/workerponds")}
          title="Assigned Ponds"
          value={dashboardData?.totalPonds || 0}
          icon={<Pool sx={{ color: theme.palette.secondary[300], fontSize: "30px" }} />}
        />

        {/* 3. Tasks */}
        <StatCard 
          onClick={() => navigate("/workertasks")}
          title="Assigned Tasks"
          value={dashboardData?.totalTasks || 0}
          icon={<Assignment sx={{ color: theme.palette.secondary[300], fontSize: "30px" }} />}
        />

        {/* 4. Fish Stock */}
        <StatCard 
          onClick={() => navigate("/workerfishstock")}
          title="Fish Stock Records"
          value={dashboardData?.totalFishStock || 0}
          icon={<SetMeal sx={{ color: theme.palette.secondary[300], fontSize: "30px" }} />}
        />
      </Box>
    </Box>
  );
};

// ✅ StatCard Component
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

export default WorkerDashboard;
