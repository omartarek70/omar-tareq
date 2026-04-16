"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";

interface AuthCtx { user:User|null; token:string|null; login:(t:string,u:User)=>void; logout:()=>void; isAuthenticated:boolean; }
const Ctx = createContext<AuthCtx|null>(null);

export function AuthProvider({ children }:{ children:ReactNode }) {
  const [token, setToken] = useState<string|null>(null);
  const [user, setUser] = useState<User|null>(null);
  useEffect(() => {
    const t = localStorage.getItem("token"), u = localStorage.getItem("user");
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
  }, []);
  function login(t:string, u:User) { localStorage.setItem("token",t); localStorage.setItem("user",JSON.stringify(u)); setToken(t); setUser(u); }
  function logout() { localStorage.removeItem("token"); localStorage.removeItem("user"); setToken(null); setUser(null); }
  return <Ctx.Provider value={{ user, token, login, logout, isAuthenticated:!!token }}>{children}</Ctx.Provider>;
}
export function useAuth() { const c = useContext(Ctx); if(!c) throw new Error("useAuth outside provider"); return c; }
