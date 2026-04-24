"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance, { updateAccessToken } from "../lib/axios";

interface AuthContextType {
  isLoggedIn: boolean;
  signin: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string, role?: string) => Promise<any>;
  signout: (callback: () => void) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const apiProvider = {
  signin: async (email: string, password: string) => {
    try {
      const { data } = await axiosInstance.post("/login", {
        name: email,
        password,
      });
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      
      if (data.user_id) {
        localStorage.setItem("userId", data.user_id.toString());
      }

      updateAccessToken(data.access_token);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  register: async (name: string, email: string, password: string, role?: string) => {
    try {
      const { data } = await axiosInstance.post("/register", {
        name,
        email,
        password,
        role
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  signout: async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        updateAccessToken(accessToken);
      }

      const { data } = await axiosInstance.delete("/logout");
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setLoggedIn(true);
      updateAccessToken(token);
    }
    setIsReady(true);
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      const data = await apiProvider.signin(email, password);
      setLoggedIn(true);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    return await apiProvider.register(name, email, password, role);
  };

  const signout = async (callback: () => void) => {
    try {
      await apiProvider.signout();
      setLoggedIn(false);
    } catch (error) {
      throw error;
    } finally {
      callback();
    }
  };

  const value = { isLoggedIn, signin, signout, register };

  if (!isReady) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}