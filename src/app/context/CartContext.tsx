"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Cart } from "@/types";
const API = "https://ecommerce.routemisr.com/api/v1";
interface CartCtx { cart:Cart|null; cartCount:number; loading:boolean; addToCart:(id:string)=>Promise<boolean>; removeFromCart:(id:string)=>Promise<void>; updateCount:(id:string,n:number)=>Promise<void>; clearCart:()=>Promise<void>; fetchCart:()=>Promise<void>; }
const Ctx = createContext<CartCtx|null>(null);
const tok = () => typeof window!=="undefined" ? localStorage.getItem("token") : null;

export function CartProvider({ children }:{ children:ReactNode }) {
  const [cart, setCart] = useState<Cart|null>(null);
  const [loading, setLoading] = useState(false);
  
  async function fetchCart() { 
    const t=tok(); 
    if(!t) return; 
    try {
      const r=await fetch(`${API}/cart`,{headers:{token:t}}); 
      if(!r.ok) {
        const body = await r.text();
        console.error("Cart fetch failed:", r.status, body);
        return;
      }
      const d=await r.json(); 
      if(d.status==="success") setCart(d.data);
      else console.warn("Cart API returned non-success status:", d);
    } catch(e) {
      console.error("Error fetching cart:", e);
    }
  }
  
  useEffect(() => { fetchCart(); }, []);
  
  async function addToCart(productId:string) { 
    const t=tok(); 
    if(!t) return false; 
    setLoading(true); 
    try { 
      const r=await fetch(`${API}/cart`,{method:"POST",headers:{"Content-Type":"application/json",token:t},body:JSON.stringify({productId})}); 
      if(!r.ok) {
        const body = await r.text();
        console.error("Add to cart failed:", r.status, body);
        return false;
      }
      const d=await r.json(); 
      if(d.status==="success"){setCart(d.data);return true;} 
      console.warn("Add to cart API returned non-success status:", d);
      return false; 
    } catch(e) {
      console.error("Error adding to cart:", e);
      return false;
    } finally { 
      setLoading(false); 
    } 
  }
  
  async function removeFromCart(id:string) { 
    const t=tok(); 
    if(!t) return; 
    try {
      const r=await fetch(`${API}/cart/${id}`,{method:"DELETE",headers:{token:t}}); 
      const d=await r.json(); 
      if(d.status==="success") setCart(d.data);
    } catch(e) {
      console.error("Error removing from cart:", e);
    }
  }
  
  async function updateCount(id:string,count:number) { 
    const t=tok(); 
    if(!t) return; 
    try {
      const r=await fetch(`${API}/cart/${id}`,{method:"PUT",headers:{"Content-Type":"application/json",token:t},body:JSON.stringify({count})}); 
      const d=await r.json(); 
      if(d.status==="success") setCart(d.data);
    } catch(e) {
      console.error("Error updating cart count:", e);
    }
  }
  
  async function clearCart() { 
    const t=tok(); 
    if(!t) return; 
    try {
      await fetch(`${API}/cart`,{method:"DELETE",headers:{token:t}}); 
      setCart(null);
    } catch(e) {
      console.error("Error clearing cart:", e);
    }
  }
  
  const cartCount = cart?.products?.reduce((s,i)=>s+i.count,0)??0;
  return <Ctx.Provider value={{cart,cartCount,loading,addToCart,removeFromCart,updateCount,clearCart,fetchCart}}>{children}</Ctx.Provider>;
}
export function useCart() { const c=useContext(Ctx); if(!c) throw new Error("useCart outside provider"); return c; }
