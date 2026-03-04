import { createContext, useContext, useState } from "react";
import { api } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("shieldpro_user")) || null
  );

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem("shieldpro_user", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Login Error:", error.message);
      return false;
    }
  };

  const register = async (newUser) => {
    try {
      await api.post('/auth/register', newUser);
      return true;
    } catch (error) {
      console.error("Registration Error:", error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("shieldpro_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
