// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // ✅ prevents navbar from loading before user data loads
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const localUser = localStorage.getItem("user");
        const localToken = localStorage.getItem("token");

        if (localUser && localToken) {
          setUser(JSON.parse(localUser));
          setToken(localToken);
        }

        const res = await API.get("/users/profile");
        if (res.data) {
          setUser(res.data);
          setToken("authenticated");
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("rememberMe");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } finally {
        setAuthLoaded(true);
      }
    };

    verifyAuth();
  }, []);

  const login = (userData, jwtToken, rememberMe = true) => {
    setUser(userData);
    setToken(jwtToken);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(userData));
    storage.setItem("token", jwtToken);
    localStorage.setItem("rememberMe", rememberMe ? "true" : "false");
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    const isLocal = localStorage.getItem("rememberMe") === "true";
    const storage = isLocal ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await API.post("/users/logout");
    } catch (err) {
      console.error("Failed to call logout on backend:", err);
    }

    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    window.location.href = "/login";
  };

  // Load cart count when token changes
  useEffect(() => {
    if (token) {
      const fetchCart = async () => {
        try {
          const res = await API.get("/cart");
          const items = res.data?.items || [];
          const count = items.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(count);
        } catch (err) {
          console.error("Fetch cart count error:", err);
        }
      };
      fetchCart();
    } else {
      setCartCount(0);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, authLoaded, cartCount, setCartCount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
