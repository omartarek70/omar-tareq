"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ToastProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart,cartCount,removeFromCart,updateCount,clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  if(!isAuthenticated) return (
    <div style={{minHeight:"80vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,textAlign:"center",padding:40}}>
      <span style={{fontSize:"4rem"}}>🔒</span>
      <h2 style={{fontFamily:"var(--font-display)",fontStyle:"italic"}}>Login to see your cart</h2>
      <Link href="/login" className="btn-primary" style={{width:"auto",padding:"12px 32px",textDecoration:"none",display:"inline-flex",borderRadius:14}}>Sign In →</Link>
    </div>
  );

  const total = cart?.totalPriceAfterDiscount ?? cart?.totalCartPrice ?? 0;
  const items = cart?.products ?? [];

  return (
    <>
      <style>{`
        .cart-page{max-width:1100px;margin:0 auto;padding:52px 52px 80px;}
        .cart-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;flex-wrap:wrap;gap:14px;}
        .cart-h1{font-family:var(--font-display);font-size:2.4rem;font-weight:700;font-style:italic;color:var(--text);}
        .cart-badge2{background:var(--g100);border:1.5px solid var(--g200);color:var(--g700);padding:6px 16px;border-radius:20px;font-size:0.85rem;font-weight:700;}
        .clear-btn{background:var(--red-bg);border:1.5px solid #fca5a5;color:var(--red);padding:9px 18px;border-radius:10px;font-family:var(--font-body);font-size:0.85rem;font-weight:700;cursor:pointer;transition:all 0.2s;}
        .clear-btn:hover{background:#fee2e2;}
        .cart-layout{display:grid;grid-template-columns:1fr 330px;gap:28px;align-items:start;}
        .cart-items{display:flex;flex-direction:column;gap:14px;}
        .cart-item{background:var(--white);border:1.5px solid var(--border);border-radius:20px;padding:20px;display:flex;align-items:center;gap:16px;transition:all 0.25s;box-shadow:var(--shadow-sm);animation:fadeUp 0.4s ease both;}
        .cart-item:hover{border-color:var(--g300,var(--g200));box-shadow:var(--shadow-md);}
        .item-img{width:82px;height:82px;background:var(--bg2);border-radius:14px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}
        .item-img img{max-width:70px;max-height:70px;object-fit:contain;}
        .item-info{flex:1;min-width:0;}
        .item-cat{font-size:0.7rem;font-weight:700;color:var(--g600);text-transform:uppercase;letter-spacing:0.07em;}
        .item-name{font-weight:700;font-size:0.93rem;margin:4px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text);}
        .item-unit{color:var(--muted);font-size:0.8rem;font-weight:600;}
        .qty-row{display:flex;align-items:center;gap:10px;}
        .qty-btn{background:var(--bg2);border:1.5px solid var(--border);color:var(--text);width:32px;height:32px;border-radius:9px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all 0.2s;font-weight:700;}
        .qty-btn:hover{border-color:var(--g400);background:var(--g50);color:var(--g700);}
        .qty-n{font-family:var(--font-display);font-weight:800;font-size:1rem;min-width:24px;text-align:center;}
        .item-sub{font-family:var(--font-display);font-weight:700;font-size:1.1rem;color:var(--g700);min-width:88px;text-align:right;}
        .rm-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:1rem;padding:6px;border-radius:8px;transition:all 0.2s;}
        .rm-btn:hover{color:var(--red);background:var(--red-bg);}
        .summary-box{background:var(--white);border:1.5px solid var(--border);border-radius:22px;padding:28px;position:sticky;top:90px;box-shadow:var(--shadow-md);}
        .sum-title{font-family:var(--font-display);font-weight:700;font-size:1.15rem;margin-bottom:20px;font-style:italic;color:var(--text);}
        .sum-row{display:flex;justify-content:space-between;font-size:0.9rem;color:var(--muted);margin-bottom:12px;font-weight:600;}
        .sum-row strong{color:var(--text);}
        .sum-div{height:1.5px;background:var(--border);margin:16px 0;}
        .sum-total{display:flex;justify-content:space-between;font-family:var(--font-display);font-weight:700;font-size:1.3rem;color:var(--text);}
        .checkout-cta{width:100%;margin-top:20px;background:linear-gradient(135deg,var(--g500),var(--g700));color:#fff;border:none;padding:16px;border-radius:14px;font-family:var(--font-body);font-weight:800;font-size:1rem;cursor:pointer;transition:all 0.3s;box-shadow:0 6px 24px var(--glow);}
        .checkout-cta:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(22,163,74,0.35);}
        .cont-shop{display:block;text-align:center;margin-top:14px;color:var(--muted);font-size:0.85rem;text-decoration:none;font-weight:600;transition:color 0.2s;}
        .cont-shop:hover{color:var(--g600);}
        .ship-note{background:var(--g50);border:1.5px solid var(--g200);border-radius:12px;padding:12px 16px;text-align:center;font-size:0.8rem;color:var(--g700);margin-top:16px;font-weight:600;}
        .cart-empty{text-align:center;padding:80px 20px;grid-column:1/-1;}
        @media(max-width:768px){.cart-page{padding:28px 18px 60px;}.cart-layout{grid-template-columns:1fr;}.item-sub{display:none;}}
      `}</style>

      <div className="cart-page">
        <div className="cart-hdr">
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <h1 className="cart-h1">Your Cart</h1>
            {cartCount>0&&<span className="cart-badge2">{cartCount} items</span>}
          </div>
          {items.length>0&&<button className="clear-btn" onClick={async()=>{await clearCart();showToast("Cart cleared","warn");}}>🗑 Clear All</button>}
        </div>

        {items.length===0 ? (
          <div className="cart-empty">
            <span style={{fontSize:"5rem",display:"block",marginBottom:20}}>🛒</span>
            <h2 style={{fontFamily:"var(--font-display)",fontStyle:"italic",marginBottom:10}}>Your cart is empty</h2>
            <p style={{color:"var(--muted)",marginBottom:28}}>Add some fresh products to get started!</p>
            <Link href="/" className="btn-primary" style={{width:"auto",padding:"13px 32px",textDecoration:"none",display:"inline-flex",borderRadius:14}}>Browse Products →</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item,i)=>(
                <div className="cart-item" key={item._id} style={{animationDelay:`${i*60}ms`}}>
                  <div className="item-img"><img src={item.product.imageCover} alt={item.product.title}/></div>
                  <div className="item-info">
                    <div className="item-cat">{item.product.category?.name}</div>
                    <div className="item-name">{item.product.title}</div>
                    <div className="item-unit">{item.price} EGP each</div>
                  </div>
                  <div className="qty-row">
                    <button className="qty-btn" onClick={()=>updateCount(item.product._id,item.count-1)} disabled={item.count<=1}>−</button>
                    <span className="qty-n">{item.count}</span>
                    <button className="qty-btn" onClick={()=>updateCount(item.product._id,item.count+1)}>+</button>
                  </div>
                  <div className="item-sub">{item.price*item.count} EGP</div>
                  <button className="rm-btn" onClick={async()=>{await removeFromCart(item.product._id);showToast("Removed","info");}}>✕</button>
                </div>
              ))}
            </div>

            <div className="summary-box">
              <div className="sum-title">Order Summary</div>
              <div className="sum-row"><span>Subtotal ({cartCount} items)</span><strong>{cart?.totalCartPrice} EGP</strong></div>
              {cart?.totalPriceAfterDiscount&&<div className="sum-row"><span>Discount</span><strong style={{color:"var(--g600)"}}>-{(cart.totalCartPrice-cart.totalPriceAfterDiscount)} EGP</strong></div>}
              <div className="sum-row"><span>Shipping</span><strong style={{color:"var(--g600)"}}>Free</strong></div>
              <div className="sum-row"><span>Tax (14%)</span><strong>{Math.round(total*0.14)} EGP</strong></div>
              <div className="sum-div"/>
              <div className="sum-total"><span>Total</span><span style={{color:"var(--g700)"}}>{Math.round(total*1.14)} EGP</span></div>
              <button className="checkout-cta" onClick={()=>router.push("/checkout")}>Proceed to Checkout →</button>
              <Link href="/" className="cont-shop">← Continue Shopping</Link>
              <div className="ship-note">🚚 Free delivery on all orders!</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
