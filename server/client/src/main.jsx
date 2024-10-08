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
import Notifications from "./pages/protected/Notifications.jsx";
import GroupDetailsPage from "./pages/protected/GroupDetailsPage.jsx";
import CreateGroup from "./pages/protected/CreateGroup.jsx";
import customTheme from "./chakra/theme.js";
import GroupChat from "./pages/protected/GroupChat.jsx";
import GroupMembers from "./pages/protected/GroupMembers.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ChakraProvider theme={customTheme}>
          <Routes>
            <Route path="/" element={<PublicRoutes />}>
              <Route index element={<App />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </Route>
            <Route path="/app" element={<ProtectedRoute />}>
              <Route path="" element={<HomePage />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="create" element={<CreateGroup />} />
              <Route path="mygroups" element={<MyGroups />} />
              <Route path="group/:id" element={<GroupDetailsPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="group/:groupId/chat" element={<GroupChat />} />
              <Route path="group/:groupId/members" element={<GroupMembers />} />
            </Route>
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </ChakraProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
