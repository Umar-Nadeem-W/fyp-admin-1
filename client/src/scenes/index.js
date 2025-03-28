// Contains scenes to be exported in other files
// ! Don't remove anything from here

import Layout from "./layout";
import Dashboard from "./dashboard";
import AllFarms from "./farm/[all-farms]";
import FarmOwner from "./farm/[farmOwners]"
import EmployeeInfo from "./employee/[employee-info]";
import AddEmployee from "./employee/[add-employee]";
import ServicePlans from "./serviceplan/[list-plan]";
import AddPlan from "./serviceplan/[add-plan]";
import Workers from "./workers";
import Transactions from "./transactions";
import Geography from "./employee";
import Overview from "./overview";
import Daily from "./daily";
import Monthly from "./monthly";
import Breakdown from "./breakdown";
import Admin from "./admin";
import Performance from "./performance";
import Tasks from "./tasks";
import Analytics from "./analytics";
import Reports from "./reports";
import Announcements from "./announcements";
import Communications from "./communications";
import PondDetails from "./pond/[ponddetails]";
import PondListPage from "./pond";
// export scenes
export {
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
  Tasks,
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
  AddPlan
};