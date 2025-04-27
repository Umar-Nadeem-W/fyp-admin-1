import React, { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Theme
import { themeSettings } from "theme";

// Scenes
import {
  Alerts,
  Layout,
  Dashboard,
  Tasks,
  Ponds,
  FishStock,
  Devices,
} from "scenes/workerscenes";



// App
const App = () => {
  // Dark/Light mode
  const mode = useSelector((state) => state.global.mode);
  // theme setting
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  
  return (
    <div className="app">
      <BrowserRouter>
        {/* Theme Provider */}
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            {/* Routes */}
            <Route element={<Layout />}>  
            <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/ponds" element={<Ponds />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/fishstock" element={<FishStock />} />             
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
