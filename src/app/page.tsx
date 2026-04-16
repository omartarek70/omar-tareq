"use client";
export const dynamic = "force-dynamic";
import { Suspense, useState, useEffect, useCallback, useRef, ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Product, Category } from "@/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastProvider";

const API = "https://ecommerce.routemisr.com/api/v1";

/* ── useInView ── */
function useInView(threshold=0.12):[React.RefObject<HTMLDivElement|null>,boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting){setVisible(true);obs.disconnect();} },{threshold});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[threshold]);
  return [ref,visible];
}

/* ── Reveal wrapper ── */
function Reveal({children,delay=0,from="bottom"}:{children:ReactNode;delay?:number;from?:"bottom"|"left"|"right"}) {
  const [ref,visible] = useInView();
  const map = { bottom:"translateY(36px)", left:"translateX(-36px)", right:"translateX(36px)" };
  return (
    <div ref={ref} style={{
      opacity: visible?1:0,
      transform: visible?"none":map[from],
      transition:`opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms`
    }}>{children}</div>
  );
}

/* ── Magnetic btn ── */
function MagBtn({children,className,onClick,disabled,style}:{children:ReactNode;className?:string;onClick?:(e:MouseEvent<HTMLButtonElement>)=>void;disabled?:boolean;style?:React.CSSProperties}) {
  const r = useRef<HTMLButtonElement>(null);
  const move=(e:MouseEvent<HTMLButtonElement>)=>{
    if(!r.current)return;
    const b=r.current.getBoundingClientRect();
    r.current.style.transform=`translate(${((e.clientX-b.left)/b.width-0.5)*8}px,${((e.clientY-b.top)/b.height-0.5)*8}px) scale(1.03)`;
  };
  const leave=()=>{ if(r.current) r.current.style.transform="translate(0,0) scale(1)"; };
  return <button ref={r} className={className} onClick={onClick} disabled={disabled} style={{transition:"transform 0.3s cubic-bezier(.22,1,.36,1)",...style}} onMouseMove={move} onMouseLeave={leave}>{children}</button>;
}

/* ── Skeleton ── */
function Skel({w="100%",h=16,r=10}:{w?:string|number;h?:number;r?:number}) {
  return <div style={{width:w,height:h,borderRadius:r,background:"linear-gradient(90deg,#e6f4ec 25%,#f0faf4 50%,#e6f4ec 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite"}} />;
}

/* ── Decorative blob ── */
function Blob({style}:{style?:React.CSSProperties}) {
  return <div style={{borderRadius:"60% 40% 30% 70% / 60% 30% 70% 40%",animation:"borderDance 8s ease-in-out infinite",...style}} />;
}

/* ── Product Card ── */
function ProductCard({product,delay=0}:{product:Product;delay?:number}) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [adding,setAdding]=useState(false);
  const [added,setAdded]=useState(false);
  const [liked,setLiked]=useState(false);
  const [ripple,setRipple]=useState<{x:number;y:number}|null>(null);

  async function handleAdd(e:MouseEvent<HTMLButtonElement>) {
    const rect=e.currentTarget.getBoundingClientRect();
    setRipple({x:e.clientX-rect.left,y:e.clientY-rect.top});
    setTimeout(()=>setRipple(null),700);
    const t=typeof window!=="undefined"?localStorage.getItem("token"):null;
    if(!t){showToast("Please sign in first","warn");return;}
    setAdding(true);
    const ok=await addToCart(product._id);
    if(ok){showToast("✓ Added to cart!");setAdded(true);setTimeout(()=>setAdded(false),2200);}
    else showToast("Failed to add","error");
    setAdding(false);
  }

  const disc=product.priceAfterDiscount?Math.round(((product.price-product.priceAfterDiscount)/product.price)*100):null;
  const stars=Math.round(product.ratingsAverage||0);

  return (
    <Reveal delay={delay}>
      <div className="pcard">
        <div className="pcard-top">
          <img src={product.imageCover} alt={product.title} className="pcard-img" loading="lazy" />
          <div className="pcard-top-overlay"/>
          <div className="pcard-badges">
            {disc && <span className="pbadge red">-{disc}%</span>}
            {product.ratingsQuantity>100 && <span className="pbadge gold">🔥</span>}
          </div>
          <button className={`heart-btn ${liked?"liked":""}`} onClick={()=>setLiked(l=>!l)}>
            {liked?"❤️":"🤍"}
          </button>
          <div className="pcard-hover-bar">
            <MagBtn className={`quick-add ${added?"done":""}`} onClick={handleAdd} disabled={adding}>
              {adding?<span className="spinner-white"/>:added?"✓ Added":"Quick Add →"}
            </MagBtn>
          </div>
        </div>
        <div className="pcard-body">
          <span className="pcard-cat">{product.category?.name}</span>
          <h3 className="pcard-title">{product.title}</h3>
          <div className="pcard-stars">
            {Array.from({length:5}).map((_,i)=>(
              <span key={i} style={{color:i<stars?"#1d3557":"#d9dfe7",fontSize:"0.78rem",transition:`color 0.2s ${i*50}ms`}}>★</span>
            ))}
            <span className="pcard-rating-val">{product.ratingsAverage?.toFixed(1)}</span>
            <span className="pcard-rating-cnt">({product.ratingsQuantity})</span>
          </div>
          <div className="pcard-foot">
            <div>
              <div className="pcard-price">{product.priceAfterDiscount??product.price}<span style={{fontSize:"0.68rem",fontWeight:600,marginLeft:2}}>EGP</span></div>
              {product.priceAfterDiscount&&<div className="pcard-old">{product.price} EGP</div>}
            </div>
            <MagBtn className={`cart-btn ${added?"done":""}`} onClick={handleAdd} disabled={adding} style={{position:"relative",overflow:"hidden"}}>
              {ripple&&<span className="btn-ripple" style={{left:ripple.x,top:ripple.y}}/>}
              {adding?<span className="spinner-white"/>:added?"✓":"🛒"}
            </MagBtn>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Main page ── */
function HomePageContent() {
  const searchParams = useSearchParams();
  const [products,setProducts]=useState<Product[]>([]);
  const [categories,setCategories]=useState<Category[]>([]);
  const [loading,setLoading]=useState(true);
  const [catLoading,setCatLoading]=useState(true);
  const [activeCategory,setActiveCategory]=useState("all");
  const [activeBrand,setActiveBrand]=useState("all");
  const [search,setSearch]=useState("");
  const [sort,setSort]=useState("-ratingsAverage");
  const [page,setPage]=useState(1);
  const [totalPages,setTotalPages]=useState(1);
  const [heroVisible,setHeroVisible]=useState(false);

  useEffect(()=>{ setTimeout(()=>setHeroVisible(true),80); },[]);

  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    const brand = searchParams.get("brand") || "all";
    setActiveCategory(cat);
    setActiveBrand(brand);
  }, [searchParams]);

  useEffect(()=>{
    fetch(`${API}/categories`).then(r=>r.json()).then(d=>{setCategories(d.data??[]);setCatLoading(false);}).catch(()=>setCatLoading(false));
  },[]);

  const fetchProducts = useCallback(()=>{
    setLoading(true);
    const c=activeCategory!=="all"?`&category=${activeCategory}`:"";
    const b=activeBrand!=="all"?`&brand=${activeBrand}`:"";
    const s=search?`&keyword=${search}`:"";
    fetch(`${API}/products?limit=12&page=${page}&sort=${sort}${c}${b}${s}`)
      .then(r=>r.json()).then(d=>{ setProducts(d.data??[]); setTotalPages(d.metadata?.numberOfPages??1); setLoading(false); })
      .catch(()=>setLoading(false));
  },[activeCategory,activeBrand,page,sort,search]);

  useEffect(()=>{ fetchProducts(); },[fetchProducts]);
  useEffect(()=>{ setPage(1); },[activeCategory,activeBrand,search,sort]);

  const filtered=products;

  /* ── Floating shapes for hero ── */
  const shapes=[
    {emoji:"🥑",top:"18%",left:"8%",size:56,dur:6,delay:0},
    {emoji:"🥦",top:"65%",left:"5%",size:44,dur:7,delay:1.5},
    {emoji:"🍓",top:"25%",right:"6%",size:50,dur:5.5,delay:0.8},
    {emoji:"🍋",top:"70%",right:"8%",size:42,dur:8,delay:2},
    {emoji:"🥕",top:"45%",left:"3%",size:38,dur:6.5,delay:3},
    {emoji:"🫐",top:"50%",right:"4%",size:46,dur:7.5,delay:1},
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-noise"/>
        <div className="hero-blob1"/>
        <div className="hero-blob2"/>

        {/* Floating food emojis */}
        {shapes.map((s,i)=>(
          <div key={i} className="float-emoji" style={{
            top:s.top, left:(s as any).left, right:(s as any).right,
            "--size":`${s.size}px`,"--dur":`${s.dur}`,"--delay":`${s.delay}`
          } as React.CSSProperties}>{s.emoji}</div>
        ))}

        <div className="hero-content">
          <div style={{opacity:heroVisible?1:0,transform:heroVisible?"none":"translateY(24px)",transition:"all 0.7s cubic-bezier(.22,1,.36,1)"}}>
            <div className="hero-eyebrow"><span className="hero-eyebrow-dot"/>🌿 New Harvest Season</div>
          </div>
          <div style={{opacity:heroVisible?1:0,transform:heroVisible?"none":"translateY(32px)",transition:"all 0.8s cubic-bezier(.22,1,.36,1) 100ms"}}>
            <h1 className="hero-h1">
              Food that's<br/><em>genuinely</em><br/>good for you.
            </h1>
          </div>
          <div style={{opacity:heroVisible?1:0,transform:heroVisible?"none":"translateY(24px)",transition:"all 0.7s ease 250ms"}}>
            <p className="hero-p">Fresh-picked produce, pantry staples, and trusted brands — delivered same-day to your door.</p>
          </div>
          <div style={{opacity:heroVisible?1:0,transition:"all 0.6s ease 360ms"}}>
            <div className="hero-pills">
              {[["10K+","Products"],["50K+","Customers"],["Free","Delivery"],["Same","Day"]].map(([v,l])=>(
                <div className="hero-pill" key={l}><b>{v}</b> {l}</div>
              ))}
            </div>
          </div>
          <div style={{opacity:heroVisible?1:0,transform:heroVisible?"none":"translateY(16px)",transition:"all 0.6s ease 450ms"}}>
            <div className="hero-btns">
              <MagBtn className="hero-cta">Shop Now <span className="arr">→</span></MagBtn>
              <Link href="/products" className="hero-ghost">Browse All</Link>
            </div>
          </div>
        </div>

        {/* Floating stat cards */}
        <div className="hero-stats">
          {[["10K+","Products"],["4.9 ★","Avg Rating"],["30min","Delivery"]].map(([v,l],i)=>(
            <div key={l} className="stat-card" style={{opacity:heroVisible?1:0,transform:heroVisible?"none":"translateX(32px)",transition:`all 0.7s cubic-bezier(.22,1,.36,1) ${350+i*140}ms`}}>
              <div className="stat-num">{v}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <div className="features-strip">
        <div className="features-inner">
          {[["🚚","Free Delivery","On all orders"],["🌿","100% Organic","Farm fresh picks"],["♻️","Eco Packaging","Sustainable always"],["⭐","Top Rated","50K+ happy customers"]].map(([icon,title,desc])=>(
            <Reveal key={title}>
              <div className="feat-item">
                <span className="feat-icon">{icon}</span>
                <div className="feat-title">{title}</div>
                <div className="feat-desc">{desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <div className="section">
        {/* Categories */}
        <Reveal>
          <div className="section-head">
            <div className="section-title"><span className="title-line"/>Shop by Category</div>
          </div>
        </Reveal>
        <div className="cats-row">
          <button className={`cat-chip ${activeCategory==="all"?"active":""}`} onClick={()=>{setActiveCategory("all"); setActiveBrand("all");}}>✦ All</button>
          {catLoading ? Array(7).fill(0).map((_,i)=><div className="cat-skel" key={i}/>) :
            categories.map(c=>(
              <button key={c._id} className={`cat-chip ${activeCategory===c._id?"active":""}`} onClick={()=>{setActiveCategory(c._id); setActiveBrand("all");}}>{c.name}</button>
            ))}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <span className="results-note">Showing <b>{filtered.length}</b> products</span>
          <select className="sort-sel" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="-ratingsAverage">⭐ Top Rated</option>
            <option value="-sold">🔥 Best Selling</option>
            <option value="price">Price ↑</option>
            <option value="-price">Price ↓</option>
            <option value="-createdAt">🆕 Newest</option>
          </select>
        </div>

        {/* Grid */}
        <div className="pgrid">
          {loading
            ? Array(12).fill(0).map((_,i)=>(
                <div className="skel-card" key={i}>
                  <div className="skel-img"/>
                  <div className="skel-b"><Skel h={10} w="48%"/><Skel h={14}/><Skel h={11} w="60%"/><Skel h={38} r={12}/></div>
                </div>
              ))
            : filtered.length===0
            ? <div className="empty"><span style={{fontSize:"3.5rem",display:"block",marginBottom:14}}>🔍</span><p>No results for "<b>{search}</b>"</p></div>
            : filtered.map((p,i)=><ProductCard key={p._id} product={p} delay={(i%12)*50}/>)
          }
        </div>

        {/* Pagination */}
        {!loading && totalPages>1 && (
          <div className="pager">
            <button className="pg-btn" onClick={()=>setPage(p=>p-1)} disabled={page===1}>‹</button>
            {Array.from({length:totalPages},(_,i)=>i+1)
              .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=2)
              .reduce<(number|string)[]>((acc,p,i,arr)=>{ if(i>0&&(arr[i-1] as number)!==p-1) acc.push("..."); acc.push(p); return acc; },[])
              .map((p,i)=>p==="..."
                ? <span key={`d${i}`} style={{color:"var(--muted)",padding:"0 4px"}}>…</span>
                : <button key={p} className={`pg-btn ${page===p?"active":""}`} onClick={()=>setPage(p as number)}>{p}</button>
              )}
            <button className="pg-btn" onClick={()=>setPage(p=>p+1)} disabled={page===totalPages}>›</button>
          </div>
        )}
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
