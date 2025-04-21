import React, { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Theme
import { themeSettings } from "theme";

// Scenes
import {
  Tasks,
  Layout,
  Dashboard,
  Workers,
  Transactions,
  Geography,
  Overview,
  Daily,
  Monthly,
  Breakdown,
  Admin,
  Performance,
  Analytics,
  Reports,
  Announcements, 
  Communications,
  PondDetails,
  PondListPage,
  AllFarms,
  FarmOwner,
  EmployeeInfo,
  AddEmployee,
  ServicePlans,
  AddPlan,
  Auth
} from "scenes";

// App
const App = () => {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* ✅ Public route without layout */}
            <Route path="/auth" element={<Auth />} />

            {/* ✅ All dashboard routes wrapped inside layout */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/all-farms" element={<AllFarms />} />
              <Route path="/farmsOwners" element={<FarmOwner />} />
              <Route path="/employee-info" element={<EmployeeInfo />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/list-plan" element={<ServicePlans />} />
              <Route path="/add-plan" element={<AddPlan />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="/pond" element={<PondListPage />} />
              <Route path="/pond/ponddetails/:PondId" element={<PondDetails />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/communications" element={<Communications />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
