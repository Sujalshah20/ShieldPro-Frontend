/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { api } from "../utils/api";
import { useToast } from "../hooks/use-toast";

import { queryClient } from "../utils/QueryClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfileState] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();
  const activityTimer = useRef(null);

  // Initial session check from HTTP-Only cookie OR LocalStorage token
  useEffect(() => {
    const verifySession = async () => {
        const localToken = localStorage.getItem('token');
        
        // Skip verification if no token is present to avoid unnecessary 401 errors
        if (!localToken || localToken === 'undefined' || localToken === 'null') {
            setIsInitializing(false);
            return;
        }

        try {
            // Even if we have a token, we verify it with the backend
            const userData = await api.get('/auth/me', localToken);
            setUser({ ...userData, token: localToken });
        } catch (error) {
            // BUG FIX: `user` is always null here (initial render), so we use
            // the localToken as the signal that a session existed and has expired.
            if (error.status === 401 && localToken) {
                toast({
                    title: "Session Expired",
                    description: "Your session has expired. Please login again.",
                    variant: "destructive"
                });
            }
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setIsInitializing(false);
        }
    };
    verifySession();
  }, []);
  
  const setProfile = useCallback((profileData) => {
    setProfileState(profileData);
    if (profileData && user) {
        setUser(prevUser => ({
            ...prevUser,
            ...profileData,
            // Ensure token is preserved if it exists only in the auth user state
            token: prevUser.token || profileData.token 
        }));
    }
  }, [user]);

  const logout = useCallback(async () => {
    try {
        await api.post('/auth/logout');
    } catch (e) {
        console.error("Logout failed", e);
    }
    
    // Clear React Query cache to prevent data leakage between sessions
    queryClient.clear();
    
    localStorage.removeItem('token');
    setUser(null);
    // BUG FIX: Call setProfileState directly instead of setProfile().
    // setProfile() tries to spread profileData into user state, which crashes
    // when called with null. Also avoids a circular dep with setProfile's [user] dep.
    setProfileState(null);
  }, []);

  // Set Auth Data Manually for specific cases (like OAuth in Login page returning data)
  const setAuthData = useCallback((userData) => {
      if (userData.token) {
          localStorage.setItem('token', userData.token);
      }
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

  const login = async (email, password, rememberMe, portalRole) => {
    try {
      const data = await api.post('/auth/login', { email, password, rememberMe, portalRole });
      if (data.token) {
          localStorage.setItem('token', data.token);
      }
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
