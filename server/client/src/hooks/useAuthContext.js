import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuthContext() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used inside the AuthContextProvider");
  }
  return authContext;
}
