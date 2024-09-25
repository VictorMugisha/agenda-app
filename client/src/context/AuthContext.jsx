/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constants/constants";

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("inside the auth useeffect");
    async function checkAuth() {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/verify-token`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log("Error during token verification", error);
        setIsAuthenticated(false);
      }
    }

    checkAuth();
  }, [location.pathname]);

  function logout() {
    fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setIsAuthenticated(false);
      navigate("/auth/login");
    });
  }

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
