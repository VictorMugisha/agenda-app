import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import "./index.css";

import AppLayout from "./layouts/AppLayout.jsx";
import HomePage from "./pages/protected/HomePage.jsx";

import { ChakraProvider } from "@chakra-ui/react";
import AuthContextProvider from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ChakraProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="/app" element={<AppLayout />}>
              <Route path="" element={<HomePage />} />
            </Route>
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </ChakraProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>
);
