/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { api } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("shieldpro_user")) || null
  );
  const [profile, setProfile] = useState(null);
  const activityTimer = useRef(null);
  
  const logout = useCallback(() => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem("shieldpro_user");
  }, []);

  // 30 mins inactivity Auto-Logout
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (activityTimer.current) clearTimeout(activityTimer.current);
      // 30 minutes = 30 * 60 * 1000 = 1800000 ms
      activityTimer.current = setTimeout(logout, 1800000);
    };

    resetTimer();

    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      if (activityTimer.current) clearTimeout(activityTimer.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user, logout]);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem("shieldpro_user", JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Login Error:", error.message);
      throw error;
    }
  };

  const register = async (newUser) => {
    try {
      await api.post('/auth/register', newUser);
      return true;
    } catch (error) {
      console.error("Registration Error:", error.message);
      throw error;
    }
  };

  // logout is now useCallback above to avoid dependency loops
  return (
    <AuthContext.Provider value={{ user, profile, setProfile, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
