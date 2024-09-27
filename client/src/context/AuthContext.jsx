/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("agenda_token")
  );

  const setToken = (token) => {
    localStorage.setItem("agenda_token", token);
    setIsAuthenticated(true);
  };

  const removeToken = () => {
    localStorage.removeItem("agenda_token");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleTokenChange = () => {
      const token = localStorage.getItem("agenda_token");
      setIsAuthenticated(!!token);
    };

    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  const value = {
    isAuthenticated,
    setToken,
    removeToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
