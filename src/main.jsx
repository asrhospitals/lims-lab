import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import AdminLogin from "./LoginPage.jsx";
import App from "./App.jsx";
import PhlebotomistApp from "./PhlebotomistApp.jsx";
import ReceptionApp from "./ReceptionApp.jsx";
import DoctorApp from "./DoctorApp.jsx";

// Get the stored role from localStorage
const role = localStorage.getItem("role");

// Choose the component to render based on role
let RootComponent;

switch (role) {
  case "admin":
    RootComponent = App;
    break;
  case "phlebotomist":
    RootComponent = PhlebotomistApp;
    break;
  case "reception":
    RootComponent = ReceptionApp;
    break;
  case "doctor":
    RootComponent = DoctorApp;
    break;
  default:
    RootComponent = AdminLogin; // fallback, could also be a LoginPage or ErrorPage
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>
);
