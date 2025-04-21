import React, { useState, useEffect, useCallback } from "react";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChartBox from "scenes/dashboard/ChartsSection";
import {
  FlexBetween,
  Header,
  StatBox,
} from "components";
import axios from "axios";

// Set base URL for API requests - adjust this to match your backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isNonMediumScreen = useMediaQuery("(min-width: 1200px)");
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move fetchDashboardData outside useEffect so it can be reused in handleRetry
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/dashboard');
      
      if (response.data) {
        setDashboardData(response.data);
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed since it's not using any external state/props

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleExportReports = async () => {
    try {
      // Request the report from your backend
      const response = await axios.get('/api/dashboard/export', {
        responseType: 'blob'
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download report. Please try again later.');
    }
  };

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
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRetry}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }
  
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        {/* Header */}
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
  
        {/* Download Reports */}
        <Box>
          <Button
            onClick={handleExportReports}
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
  
              "&:hover": {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary.light,
              },
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>
  
      {/* StatBoxes */}
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreen ? undefined : "span 12",
          },
        }}
      >
        <Box onClick={() => navigate("/farmsOwners")} sx={{ cursor: "pointer", gridColumn: isNonMediumScreen ? "span 3" : "span 12" }}>
          <StatBox
            title="Farm Owner"
            value={dashboardData?.stats?.totalFarmOwners || 0}
            description="Since last month"
            icon={
              <Email
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box onClick={() => navigate("/all-farms")} sx={{ cursor: "pointer", gridColumn: isNonMediumScreen ? "span 3" : "span 12" }}>
          <StatBox
            title="Total Farms"
            value={dashboardData?.stats?.totalFarms || 0}
            description="Since last month"
            icon={
              <PointOfSale
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box onClick={() => navigate("/employee-info")} sx={{ cursor: "pointer", gridColumn: isNonMediumScreen ? "span 3" : "span 12" }}>
          <StatBox
            title="Total Employee"
            value={dashboardData?.stats?.totalEmployees || 0}
            description="Since last month"
            icon={
              <PersonAdd
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box onClick={() => navigate("/list-plan")} sx={{ cursor: "pointer", gridColumn: isNonMediumScreen ? "span 3" : "span 12" }}>
          <StatBox
            title="Service Plan"
            value={dashboardData?.stats?.totalServicePlans || 0}
            description="Since last month"
            icon={
              <Traffic
                sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
              />
            }
          />
        </Box>
      </Box>
  
      {/* Chart Boxes */}
      {dashboardData?.charts && (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="300px"
          gap="20px"
          sx={{
            "& > div": {
              gridColumn: isNonMediumScreen ? "span 6" : "span 12",
            },
          }}
        >
          <ChartBox
            title="Farm Owner Trend"
            data={dashboardData.charts.farmOwners}
            dataKey="value"
            chartType="pie"
            color="#4caf50"
          />
          <ChartBox
            title="Total Farms Over Time"
            data={dashboardData.charts.totalFarms}
            dataKey="value"
            chartType="pie"
            color="#2196f3"
          />
          <ChartBox
            title="Employee Growth"
            data={dashboardData.charts.employees}
            dataKey="value"
            chartType="pie"
            color="#ff9800"
          />
          <ChartBox
            title="Service Plan Adoption"
            data={dashboardData.charts.servicePlans}
            dataKey="value"
            chartType="pie"
            color="#9c27b0"
          />
        </Box>
      )}
    </Box>
  );
};  

export default Dashboard;