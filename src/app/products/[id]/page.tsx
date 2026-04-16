"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastProvider";
import Link from "next/link";
const API = "https://ecommerce.routemisr.com/api/v1";

export default function ProductDetailPage() {
  const { id } = useParams<{id:string}>();
  const [product,setProduct]=useState<Product|null>(null);
  const [related,setRelated]=useState<Product[]>([]);
  const [loading,setLoading]=useState(true);
  const [activeImg,setActiveImg]=useState(0);
  const [adding,setAdding]=useState(false);
  const [added,setAdded]=useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(()=>{
    setLoading(true);
    fetch(`${API}/products/${id}`).then(r=>r.json()).then(d=>{
      setProduct(d.data); setActiveImg(0);
      if(d.data?.category?._id)
        fetch(`${API}/products?category=${d.data.category._id}&limit=6`).then(r=>r.json())
          .then(rd=>setRelated((rd.data??[]).filter((p:Product)=>p._id!==id)));
      setLoading(false);
    }).catch(()=>setLoading(false));
  },[id]);

  async function handleAdd() {
    const t=typeof window!=="undefined"?localStorage.getItem("token"):null;
    if(!t){showToast("Please login first!","warn");return;}
    setAdding(true);
    const ok=await addToCart(product!._id);
    if(ok){showToast("✓ Added to cart!");setAdded(true);setTimeout(()=>setAdded(false),2500);}
    else showToast("Failed to add","error");
    setAdding(false);
  }

  if(loading) return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"52px 52px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48}}>
        <div style={{height:440,borderRadius:24,background:"linear-gradient(90deg,#e6f4ec 25%,#f0faf4 50%,#e6f4ec 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}/>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {[120,60,180,48,58].map((h,i)=><div key={i} style={{height:h,borderRadius:12,background:"linear-gradient(90deg,#e6f4ec 25%,#f0faf4 50%,#e6f4ec 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}}/>)}
        </div>
      </div>
    </div>
  );

  if(!product) return (
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <span style={{fontSize:"4rem",display:"block",marginBottom:16}}>😕</span>
      <h2 style={{fontFamily:"var(--font-display)",fontStyle:"italic"}}>Product not found</h2>
      <Link href="/" style={{color:"var(--g600)",textDecoration:"none",marginTop:12,display:"inline-block",fontWeight:700}}>← Back to Home</Link>
    </div>
  );

  const images=[product.imageCover,...(product.images??[])].filter(Boolean);
  const disc=product.priceAfterDiscount?Math.round(((product.price-product.priceAfterDiscount)/product.price)*100):null;
  const stars=Math.round(product.ratingsAverage||0);

  return (
    <>
      <style>{`
        .dp{max-width:1100px;margin:0 auto;padding:52px 52px 80px;}
        .breadcrumb{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:0.83rem;font-weight:600;margin-bottom:36px;}
        .breadcrumb a{color:var(--muted);text-decoration:none;transition:color 0.2s;}
        .breadcrumb a:hover{color:var(--g600);}
        .bc-sep{color:var(--border2);}
        .dp-grid{display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:start;}
        .gallery{position:sticky;top:90px;}
        .main-img-box{background:linear-gradient(160deg,var(--g50),var(--bg2));border:1.5px solid var(--border);border-radius:24px;height:420px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:14px;position:relative;box-shadow:var(--shadow-md);}
        .main-img-box img{max-height:360px;max-width:88%;object-fit:contain;transition:transform 0.4s cubic-bezier(.22,1,.36,1);filter:drop-shadow(0 8px 20px rgba(29,53,87,0.1));}
        .main-img-box:hover img{transform:scale(1.07);}
        .img-disc{position:absolute;top:14px;left:14px;background:var(--red);color:#fff;font-size:0.76rem;font-weight:800;padding:4px 11px;border-radius:8px;}
        .thumbs{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;}
        .thumbs::-webkit-scrollbar{display:none;}
        .thumb{width:68px;height:68px;background:var(--bg2);border:2px solid var(--border);border-radius:13px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.22s;overflow:hidden;flex-shrink:0;}
        .thumb.active{border-color:var(--g500);box-shadow:0 0 0 3px var(--glow2);}
        .thumb img{max-width:56px;max-height:56px;object-fit:contain;}
        .dp-info{display:flex;flex-direction:column;gap:22px;animation:fadeUp 0.5s ease both;}
        .dp-cat{font-size:0.76rem;font-weight:800;color:var(--g600);text-transform:uppercase;letter-spacing:0.1em;}
        .dp-title{font-family:var(--font-display);font-size:1.9rem;font-weight:700;line-height:1.15;font-style:italic;color:var(--text);}
        .dp-rating{display:flex;align-items:center;gap:8px;}
        .dp-stars{display:flex;gap:2px;}
        .dp-rval{font-weight:800;font-size:0.9rem;color:var(--text);}
        .dp-rcnt{color:var(--muted);font-size:0.85rem;font-weight:500;}
        .dp-price-row{display:flex;align-items:baseline;gap:14px;}
        .dp-price{font-family:var(--font-display);font-size:2.4rem;font-weight:700;color:var(--g700);}
        .dp-old{font-size:1.1rem;color:var(--muted);text-decoration:line-through;font-weight:500;}
        .dp-desc{color:var(--text2);line-height:1.8;font-size:0.95rem;font-weight:500;background:var(--bg2);border-radius:14px;padding:16px 18px;border:1.5px solid var(--border);}
        .dp-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        .meta-card{background:var(--white);border:1.5px solid var(--border);border-radius:14px;padding:14px 16px;box-shadow:var(--shadow-sm);}
        .meta-lbl{font-size:0.7rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:0.07em;margin-bottom:4px;}
        .meta-val{font-weight:700;font-size:0.92rem;color:var(--text);}
        .add-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;background:linear-gradient(135deg,var(--g500),var(--g700));color:#fff;border:none;padding:17px 32px;border-radius:16px;font-family:var(--font-body);font-weight:800;font-size:1.05rem;cursor:pointer;transition:all 0.3s;box-shadow:0 6px 28px var(--glow);letter-spacing:0.02em;}
        .add-btn:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(29,53,87,0.38);}
        .add-btn:disabled{opacity:0.7;cursor:wait;}
        .add-btn.done{background:linear-gradient(135deg,var(--g400),var(--g600));}
        .rel-section{margin-top:72px;}
        .rel-title{font-family:var(--font-display);font-size:1.6rem;font-weight:700;font-style:italic;margin-bottom:24px;display:flex;align-items:center;gap:12px;color:var(--text);}
        .rel-bar{width:5px;height:26px;background:linear-gradient(180deg,var(--g400),var(--g600));border-radius:3px;}
        .rel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:16px;}
        .rel-card{background:var(--white);border:1.5px solid var(--border);border-radius:18px;overflow:hidden;transition:all 0.25s;text-decoration:none;color:inherit;display:block;box-shadow:var(--shadow-sm);}
        .rel-card:hover{border-color:var(--g300,var(--g200));transform:translateY(-4px);box-shadow:var(--shadow-lg);}
        .rel-img{height:130px;background:var(--bg2);display:flex;align-items:center;justify-content:center;}
        .rel-img img{max-height:110px;max-width:80%;object-fit:contain;}
        .rel-body{padding:12px;}
        .rel-name{font-size:0.82rem;font-weight:600;line-height:1.4;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:var(--text);}
        .rel-price{font-family:var(--font-display);font-weight:700;font-size:0.95rem;color:var(--g700);}
        @media(max-width:768px){.dp{padding:28px 18px 60px;}.dp-grid{grid-template-columns:1fr;}.gallery{position:static;}}
      `}</style>

      <div className="dp">
        <div className="breadcrumb">
          <Link href="/">Home</Link><span className="bc-sep">›</span>
          <Link href="/">Products</Link><span className="bc-sep">›</span>
          <span style={{color:"var(--text)"}}>{product.category?.name}</span>
        </div>

        <div className="dp-grid">
          <div className="gallery">
            <div className="main-img-box">
              <img src={images[activeImg]} alt={product.title}/>
              {disc&&<div className="img-disc">-{disc}%</div>}
            </div>
            {images.length>1&&(
              <div className="thumbs">
                {images.map((img,i)=>(
                  <div key={i} className={`thumb ${activeImg===i?"active":""}`} onClick={()=>setActiveImg(i)}>
                    <img src={img} alt={`view ${i}`}/>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dp-info">
            <div className="dp-cat">{product.category?.name}</div>
            <h1 className="dp-title">{product.title}</h1>
            <div className="dp-rating">
              <div className="dp-stars">
                {Array.from({length:5}).map((_,i)=>(
                  <span key={i} style={{color:i<stars?"#f59e0b":"#d4e8db",fontSize:"0.95rem"}}>★</span>
                ))}
              </div>
              <span className="dp-rval">{product.ratingsAverage?.toFixed(1)}</span>
              <span className="dp-rcnt">({product.ratingsQuantity} reviews)</span>
            </div>
            <div className="dp-price-row">
              <span className="dp-price">{product.priceAfterDiscount??product.price} <span style={{fontSize:"0.7rem",fontWeight:600}}>EGP</span></span>
              {product.priceAfterDiscount&&<span className="dp-old">{product.price} EGP</span>}
            </div>
            {product.description&&<p className="dp-desc">{product.description}</p>}
            <div className="dp-meta">
              <div className="meta-card"><div className="meta-lbl">Brand</div><div className="meta-val">{product.brand?.name??"N/A"}</div></div>
              <div className="meta-card"><div className="meta-lbl">Stock</div><div className="meta-val" style={{color:(product.quantity??0)>0?"var(--g600)":"var(--red)"}}>{(product.quantity??0)>0?`${product.quantity} units`:"Out of Stock"}</div></div>
              <div className="meta-card"><div className="meta-lbl">Sold</div><div className="meta-val">{product.sold??0} orders</div></div>
              <div className="meta-card"><div className="meta-lbl">Category</div><div className="meta-val">{product.category?.name??"N/A"}</div></div>
            </div>
            <button className={`add-btn ${added?"done":""}`} onClick={handleAdd} disabled={adding}>
              {adding?<><span className="spinner-white"/>Adding…</>:added?"✓ Added to Cart!":"🛒 Add to Cart"}
            </button>
          </div>
        </div>

        {related.length>0&&(
          <div className="rel-section">
            <div className="rel-title"><span className="rel-bar"/>Related Products</div>
            <div className="rel-grid">
              {related.map(p=>(
                <Link href={`/products/${p._id}`} className="rel-card" key={p._id}>
                  <div className="rel-img"><img src={p.imageCover} alt={p.title}/></div>
                  <div className="rel-body">
                    <div className="rel-name">{p.title}</div>
                    <div className="rel-price">{p.priceAfterDiscount??p.price} EGP</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
