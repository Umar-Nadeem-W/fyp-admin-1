import React, { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Theme
import { themeSettings } from "theme";

// Scenes
import {
 Farms,
  Dashboard,
 CustomerQueries,
 ServicePlans,
 Subscriptions,
 Layout,
} from "scenes/employee scenes";

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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/farms" element={<Farms />} />
              <Route path="/customerqueries" element={<CustomerQueries />} />
              < Route path="/serviceplans" element={<ServicePlans />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              {/* <Route path="/tasks/view-tasks" element={<Tasks />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="farms/add-farm" element={<AddFarm />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/installations/view-installations" element={<Installations />} />
              <Route path="devices/view-devices" element={<Devices />} />
              <Route path="/fish/view-fish" element={<Fish />} />
              <Route path="ponds/view-ponds" element={<Ponds />} />
              <Route path="ponds/add-pond" element ={<Addpond/>}/>
              <Route path="/tools/new-task" element={<NewTask />} />
              <Route path="/tools/reports" element={<Reports />} />
              <Route path="/tasks/assign-task" element={<AssignTask />} />
              <Route path="devices/add-device" element={<AddDevice/>} />
              <Route path="/installations/add-installation" element={<AddInstallation/>} />
              <Route path="/subscriptions" element={<SubscriptionsPage/>} />
              <Route path="/fish/fish-details" element={<FishDetails/>} />
              <Route path="/fish/add-fish" element={<AddFish/>} /> */}
              {/* <Route path="/tools" element={<Tools />} /> */}

              {/* <Route path="/farmsOwners" element={<FarmOwner />} /> */}
              {/* <Route path="/employee-info" element={<EmployeeInfo />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/list-plan" element={<ServicePlans />} /> */}
              {/* <Route path="/add-plan" element={<AddPlan />} />
              <Route path="/reports" element={<Reports />} /> */}
              {/* <Route path="/pond" element={<PondListPage/>} />
              <Route path="/pond/ponddetails/:PondId" element={<PondDetails />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/daily" element={<Daily />} />
              <Route path="/monthly" element={<Monthly />} />
              <Route path="/breakdown" element={<Breakdown />} />
              <Route path="/admin" element={<Admin />} />
              <Route path ="/tasks" element={<Tasks/>}/>
              <Route path ='/announcements' element = {<Announcements/>}/>
              <Route path="/performance" element={<Performance />} />
              <Route path ="/analytics" element={<Analytics/>}></Route>
              <Route path ="/communications" element={<Communications/>}></Route> */}
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
