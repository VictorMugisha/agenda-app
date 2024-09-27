import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import "./index.css";
import "./App.css";

import ProtectedRoute from "./layouts/ProtectedRoute.jsx";
import HomePage from "./pages/protected/HomePage.jsx";

import { ChakraProvider } from "@chakra-ui/react";
import AuthContextProvider from "./context/AuthContext.jsx";
import PublicRoutes from "./layouts/PublicRoutes.jsx";
import MyGroups from "./pages/protected/MyGroups.jsx";
import Profile from "./pages/protected/Profile.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ChakraProvider>
          <Routes>
            <Route path="/" element={<PublicRoutes />}>
              <Route index element={<App />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </Route>
            <Route path="/app" element={<ProtectedRoute />}>
              <Route path="" element={<HomePage />} />
              <Route path="notifications" element={<MyGroups />} />
              <Route path="mygroups" element={<MyGroups />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </ChakraProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
