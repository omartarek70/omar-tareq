"use client";
import { useState, useEffect, type Key } from "react";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";
import Link from "next/link";
const API = "https://ecommerce.routemisr.com/api/v1";

export default function OrdersPage() {
  const { token,user,isAuthenticated } = useAuth();
  const [orders,setOrders]=useState<Order[]>([]);
  const [loading,setLoading]=useState(true);

  const [error,setError] = useState<string|null>(null);

  useEffect(()=>{
    if(!isAuthenticated || !user || !token) {
      setLoading(false);
      return;
    }

    const url = `${API}/orders/user/${user._id}`;

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res)=>{
        if(!res.ok) throw new Error(`Orders API status ${res.status}`);
        const data = await res.json();

        let list = [] as any;
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data.data)) list = data.data;
        else if (Array.isArray(data.orders)) list = data.orders;

        if (!Array.isArray(list)) throw new Error("Unsupported orders response format");

        setOrders(list);
      })
      .catch((err)=>{
        console.error("Failed to load orders", err);
        setError("An error occurred while loading orders. Please refresh.");
        setOrders([]);
      })
      .finally(()=>setLoading(false));
  },[isAuthenticated,user,token]);

  if(!isAuthenticated) return (
    <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,textAlign:"center",padding:40}}>
      <span style={{fontSize:"4rem"}}>🔒</span>
      <h2 style={{fontFamily:"var(--font-display)",fontStyle:"italic"}}>Login to view orders</h2>
      <Link href="/login" className="btn-primary" style={{width:"auto",padding:"12px 32px",textDecoration:"none",display:"inline-flex",borderRadius:14}}>Sign In →</Link>
    </div>
  );

  return (
    <>
      <style>{`
        .orders-page{max-width:900px;margin:0 auto;padding:52px 52px 80px;}
        .orders-h1{font-family:var(--font-display);font-size:2.4rem;font-weight:700;font-style:italic;margin-bottom:36px;color:var(--text);}
        .order-card{background:var(--white);border:1.5px solid var(--border);border-radius:22px;padding:26px;margin-bottom:18px;box-shadow:var(--shadow-sm);animation:fadeUp 0.4s ease both;transition:box-shadow 0.25s;}
        .order-card:hover{box-shadow:var(--shadow-md);}
        .ord-top{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:18px;}
        .ord-id{font-family:var(--font-display);font-weight:700;font-size:1rem;color:var(--text);}
        .ord-date{color:var(--muted);font-size:0.8rem;margin-top:2px;font-weight:500;}
        .stat-bdg{padding:5px 14px;border-radius:20px;font-size:0.76rem;font-weight:800;letter-spacing:0.03em;}
        .stat-paid{background:var(--g100);border:1.5px solid var(--g200);color:var(--g700);}
        .stat-unpaid{background:#fef3c7;border:1.5px solid #fde68a;color:#b45309;}
        .stat-deliv{background:#dbeafe;border:1.5px solid #bfdbfe;color:#1d4ed8;}
        .ord-imgs{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;}
        .ord-imgs::-webkit-scrollbar{display:none;}
        .ord-img-box{width:58px;height:58px;background:var(--bg2);border-radius:12px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;border:1.5px solid var(--border);}
        .ord-img-box img{max-width:48px;max-height:48px;object-fit:contain;}
        .ord-bot{display:flex;align-items:center;justify-content:space-between;margin-top:18px;padding-top:18px;border-top:1.5px solid var(--border);flex-wrap:wrap;gap:10px;}
        .ord-total{font-family:var(--font-display);font-weight:700;font-size:1.15rem;color:var(--g700);}
        .ord-meta{color:var(--muted);font-size:0.82rem;font-weight:600;display:flex;align-items:center;gap:6px;}
        .skel-ord{background:var(--white);border:1.5px solid var(--border);border-radius:22px;padding:26px;margin-bottom:18px;box-shadow:var(--shadow-sm);}
        .skel-l{background:linear-gradient(90deg,#e6f4ec 25%,#f0faf4 50%,#e6f4ec 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:8px;}
        @media(max-width:600px){.orders-page{padding:28px 18px 60px;}}
      `}</style>

      <div className="orders-page">
        <h1 className="orders-h1">My Orders</h1>
        {error && (
          <div style={{ marginBottom: 20, color: "#b91c1c", fontWeight: 700 }}>
            {error}
          </div>
        )}
        {loading ? Array(3).fill(0).map((_,i)=>(
          <div className="skel-ord" key={i}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
              <div className="skel-l" style={{width:160,height:18}}/>
              <div className="skel-l" style={{width:80,height:18}}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              {[1,2,3].map(j=><div key={j} className="skel-l" style={{width:58,height:58,borderRadius:12,flexShrink:0}}/>)}
            </div>
          </div>
        )) : orders.length===0 ? (
          <div style={{textAlign:"center",padding:"80px 20px"}}>
            <span style={{fontSize:"4rem",display:"block",marginBottom:16}}>📦</span>
            <h2 style={{fontFamily:"var(--font-display)",fontStyle:"italic",marginBottom:10}}>No orders yet</h2>
            <p style={{color:"var(--muted)",marginBottom:28}}>Start shopping to see your orders here.</p>
            <Link href="/" className="btn-primary" style={{width:"auto",padding:"12px 28px",textDecoration:"none",display:"inline-flex",borderRadius:14}}>Shop Now →</Link>
          </div>
        ) : orders.map((ord,i)=>(
          <div className="order-card" key={ord._id} style={{animationDelay:`${i*80}ms`}}>
            <div className="ord-top">
              <div>
                <div className="ord-id">Order #{ord._id.slice(-8).toUpperCase()}</div>
                <div className="ord-date">{new Date(ord.createdAt).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <span className={`stat-bdg ${ord.isPaid?"stat-paid":"stat-unpaid"}`}>{ord.isPaid?"✓ Paid":"⏳ Unpaid"}</span>
                {ord.isDelivered&&<span className="stat-bdg stat-deliv">📦 Delivered</span>}
              </div>
            </div>
            <div className="ord-imgs">
              {ord.cartItems?.map((item: { product: any; _id: Key | null | undefined; })=>{
                const product = item.product && typeof item.product === "object" ? item.product : null;
                const title = product?.title || "Product";
                const imageSrc = product?.imageCover || "/placeholder-58.png";
                return (
                  <div className="ord-img-box" key={item._id} title={title}>
                    <img src={imageSrc} alt={title}/>
                  </div>
                );
              })}
            </div>
            <div className="ord-bot">
              <div className="ord-total">{ord.totalOrderPrice} EGP</div>
              <div className="ord-meta">
                {ord.paymentMethodType==="card"?"💳":"💵"}
                {ord.paymentMethodType==="card"?"Card":"Cash"} · {ord.cartItems?.length??0} items
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
