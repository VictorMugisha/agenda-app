import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constants/constants";
import { useState } from "react";
import useAuthContext from "./useAuthContext";

export default function useLogin() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuthContext()
  async function login(username, password) {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.message);
      }

      toast({
        title: "Logged in Successfully!",
        description: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setToken(data.token)
      navigate("/app", { replace: true });
    } catch (error) {
      throw new Error(error.message)
    } finally {
      setLoading(false);
    }
  }

  return { loading, login };
}
