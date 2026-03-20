/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/use-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();
  const activityTimer = useRef(null);

  // Initial session check from HTTP-Only cookie 
  useEffect(() => {
    const verifySession = async () => {
        try {
            const userData = await api.get('/auth/me');
            setUser(userData);
        } catch (error) {
            if (error.status === 401 && user) {
                toast({
                    title: "Session Expired",
                    description: "Your session has expired. Please login again.",
                    variant: "destructive"
                });
            }
            setUser(null);
        } finally {
            setIsInitializing(false);
        }
    };
    verifySession();
  }, []);
  
  const logout = useCallback(async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) {
        console.error("Logout failed", e);
    }
    setUser(null);
    setProfile(null);
  }, []);

  // Set Auth Data Manually for specific cases (like OAuth in Login page returning data)
  const setAuthData = useCallback((userData) => {
      setUser(userData);
  }, []);

  // 30 mins inactivity Auto-Logout (Only if user didn't check Remember Me)
  // Since we can't reliably read HttpOnly cookie settings (expires) from JS,
  // the server enforces the true expiration.
  // We'll still keep the client-side inactivity timer as an extra security layer.
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (activityTimer.current) clearTimeout(activityTimer.current);
      // 30 minutes = 30 * 60 * 1000 = 1800000 ms
      // The server also enforces this on its token.
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

  const login = async (email, password, rememberMe) => {
    try {
      const data = await api.post('/auth/login', { email, password, rememberMe });
      setUser(data);
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

  if (isInitializing) {
      return null; // Don't render App until session check completes (avoids brief flash of login screen)
  }

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, login, logout, register, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
