"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ToastProvider";
import { ShippingAddress } from "@/types";
import Link from "next/link";

const API = "https://ecommerce.routemisr.com/api/v1";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [address, setAddress] = useState<ShippingAddress>({ details:"", phone:"", city:"" });
  const [payMethod, setPayMethod] = useState<"cash"|"card">("cash");
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});
  const [loading, setLoading] = useState(false);

  if(!isAuthenticated) return (
    <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,textAlign:"center",padding:40}}>
      <span style={{fontSize:"4rem"}}>🔒</span>
      <h2 style={{fontFamily:"var(--font-display)",fontStyle:"italic"}}>Login to checkout</h2>
      <Link href="/login" className="btn-primary" style={{width:"auto",padding:"12px 32px",textDecoration:"none",display:"inline-flex",borderRadius:14}}>Sign In →</Link>
    </div>
  );

  function validate(){
    const e:Partial<ShippingAddress>={};
    if(!address.details||address.details.length<10) e.details="Enter full address (min 10 chars)";
    if(!address.phone||!/^01[0125][0-9]{8}$/.test(address.phone)) e.phone="Valid Egyptian phone required";
    if(!address.city||address.city.length<2) e.city="City is required";
    setErrors(e); return !Object.keys(e).length;
  }

  async function handleSubmit(e:FormEvent){
    e.preventDefault(); if(!validate()) return;
    if(!cart?._id){showToast("Cart is empty!","warn");return;}
    setLoading(true);
    try {
      const ep=payMethod==="cash"?`${API}/orders/${cart._id}`:`${API}/orders/checkout-session/${cart._id}?url=http://localhost:3000`;
      const res=await fetch(ep,{method:"POST",headers:{"Content-Type":"application/json",token:token!},body:JSON.stringify({shippingAddress:address})});
      const data=await res.json();
      if(data.status==="success"){
        await clearCart();
        if(payMethod==="card"&&data.session?.url) window.location.href=data.session.url;
        else{showToast("Order placed! 🎉");router.push("/orders");}
      } else showToast(data.message||"Checkout failed","error");
    } catch{showToast("Network error","error");}
    finally{setLoading(false);}
  }

  const total = cart?.totalPriceAfterDiscount ?? cart?.totalCartPrice ?? 0;

  return (
    <>
      <style>{`
        .co-page{max-width:1000px;margin:0 auto;padding:52px 52px 80px;}
        .co-title{font-family:var(--font-display);font-size:2.4rem;font-weight:700;font-style:italic;margin-bottom:36px;color:var(--text);}
        .co-layout{display:grid;grid-template-columns:1fr 320px;gap:28px;align-items:start;}
        .co-card{background:var(--white);border:1.5px solid var(--border);border-radius:22px;padding:28px;box-shadow:var(--shadow-sm);margin-bottom:20px;}
        .co-sec-head{display:flex;align-items:center;gap:10px;font-family:var(--font-display);font-size:1.1rem;font-weight:700;margin-bottom:22px;font-style:italic;color:var(--text);}
        .co-num{width:30px;height:30px;background:var(--g100);border:1.5px solid var(--g200);border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:var(--font-body);font-size:0.82rem;font-weight:800;color:var(--g700);}
        .co-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .co-full{grid-column:1/-1;}
        .field-lbl{display:block;font-size:0.83rem;font-weight:700;color:var(--text2);margin-bottom:7px;}
        .pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .pay-opt{background:var(--bg2);border:2px solid var(--border);border-radius:16px;padding:20px;cursor:pointer;transition:all 0.25s;text-align:center;}
        .pay-opt:hover{border-color:var(--g300,var(--g200));background:var(--g50);}
        .pay-opt.sel{border-color:var(--g500);background:var(--g50);box-shadow:0 0 0 3px var(--glow2);}
        .pay-emoji{font-size:2rem;margin-bottom:8px;}
        .pay-lbl{font-weight:800;font-size:0.9rem;color:var(--text);}
        .pay-desc{color:var(--muted);font-size:0.76rem;margin-top:3px;font-weight:500;}
        .ord-sum{background:var(--white);border:1.5px solid var(--border);border-radius:22px;padding:28px;position:sticky;top:90px;box-shadow:var(--shadow-md);}
        .os-title{font-family:var(--font-display);font-size:1.1rem;font-weight:700;margin-bottom:18px;font-style:italic;}
        .os-items{display:flex;flex-direction:column;gap:12px;margin-bottom:18px;max-height:200px;overflow-y:auto;}
        .os-item{display:flex;align-items:center;gap:10px;}
        .os-img{width:46px;height:46px;background:var(--bg2);border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}
        .os-img img{max-width:38px;max-height:38px;object-fit:contain;}
        .os-name{font-size:0.8rem;font-weight:600;flex:1;color:var(--text2);}
        .os-price{font-family:var(--font-display);font-weight:700;font-size:0.88rem;color:var(--g700);}
        .os-div{height:1.5px;background:var(--border);margin:14px 0;}
        .os-row{display:flex;justify-content:space-between;font-size:0.87rem;color:var(--muted);font-weight:600;margin-bottom:8px;}
        .os-row strong{color:var(--text);}
        .os-total{display:flex;justify-content:space-between;font-family:var(--font-display);font-weight:700;font-size:1.2rem;margin-top:12px;}
        @media(max-width:768px){.co-page{padding:28px 18px 60px;}.co-layout{grid-template-columns:1fr;}.co-grid{grid-template-columns:1fr;}}
      `}</style>

      <div className="co-page">
        <h1 className="co-title">Checkout</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div className="co-layout">
            <div>
              <div className="co-card">
                <div className="co-sec-head"><span className="co-num">1</span>Shipping Address</div>
                <div className="co-grid">
                  <div className="co-full">
                    <label className="field-lbl">Street / Details</label>
                    <input className={`input-base ${errors.details?"error":""}`} placeholder="123 El-Tahrir St, Apt 4B, Cairo" value={address.details} onChange={e=>setAddress(a=>({...a,details:e.target.value}))}/>
                    {errors.details&&<div className="field-error">⚠ {errors.details}</div>}
                  </div>
                  <div>
                    <label className="field-lbl">City</label>
                    <input className={`input-base ${errors.city?"error":""}`} placeholder="Cairo" value={address.city} onChange={e=>setAddress(a=>({...a,city:e.target.value}))}/>
                    {errors.city&&<div className="field-error">⚠ {errors.city}</div>}
                  </div>
                  <div>
                    <label className="field-lbl">Phone</label>
                    <input className={`input-base ${errors.phone?"error":""}`} placeholder="01012345678" value={address.phone} onChange={e=>setAddress(a=>({...a,phone:e.target.value}))}/>
                    {errors.phone&&<div className="field-error">⚠ {errors.phone}</div>}
                  </div>
                </div>
              </div>

              <div className="co-card">
                <div className="co-sec-head"><span className="co-num">2</span>Payment Method</div>
                <div className="pay-grid">
                  {[{v:"cash",emoji:"💵",label:"Cash on Delivery",desc:"Pay when you receive"},{v:"card",emoji:"💳",label:"Credit / Debit Card",desc:"Secure online payment"}].map(p=>(
                    <div key={p.v} className={`pay-opt ${payMethod===p.v?"sel":""}`} onClick={()=>setPayMethod(p.v as "cash"|"card")}>
                      <div className="pay-emoji">{p.emoji}</div>
                      <div className="pay-lbl">{p.label}</div>
                      <div className="pay-desc">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading||!cart?.products?.length}>
                {loading?<><span className="spinner-white"/>Placing Order…</>:payMethod==="card"?"Pay Online →":"Place Order →"}
              </button>
            </div>

            <div className="ord-sum">
              <div className="os-title">Order Summary</div>
              <div className="os-items">
                {cart?.products?.map(item=>(
                  <div className="os-item" key={item._id}>
                    <div className="os-img"><img src={item.product.imageCover} alt={item.product.title}/></div>
                    <div className="os-name">{item.product.title} ×{item.count}</div>
                    <div className="os-price">{item.price*item.count} EGP</div>
                  </div>
                ))}
              </div>
              <div className="os-div"/>
              <div className="os-row"><span>Subtotal</span><strong>{cart?.totalCartPrice} EGP</strong></div>
              <div className="os-row"><span>Shipping</span><strong style={{color:"var(--g600)"}}>Free</strong></div>
              <div className="os-row"><span>Tax (14%)</span><strong>{Math.round(total*0.14)} EGP</strong></div>
              <div className="os-div"/>
              <div className="os-total"><span>Total</span><span style={{color:"var(--g700)"}}>{Math.round(total*1.14)} EGP</span></div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
