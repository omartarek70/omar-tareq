"use client";
import React, { Suspense, useState, useEffect, useCallback, useRef, ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Product, Category } from "@/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastProvider";

const API = "https://ecommerce.routemisr.com/api/v1";

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
function Skel({w="100%",h=16,r=10,style}:{w?:string|number;h?:number;r?:number;style?:React.CSSProperties}) {
  return <div style={{width:w,height:h,borderRadius:r,background:"linear-gradient(90deg,#e6f4ec 25%,#f0faf4 50%,#e6f4ec 75%)",backgroundSize:"200% 100%",animation:"shimmer 1.5s infinite",...style}} />;
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();

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

  const handleAdd = async (p:Product) => {
    const success = await addToCart(p._id);
    if (success) showToast("Added to cart!", "success");
    else showToast("Failed to add to cart", "error");
  };

  return (
    <div style={{minHeight:"100vh",padding:"20px",maxWidth:"1200px",margin:"0 auto"}}>
      <h1 style={{fontFamily:"var(--font-display)",fontSize:"2.5rem",marginBottom:"40px",textAlign:"center"}}>Our Products</h1>

      {/* Categories */}
      <div style={{marginBottom:"40px"}}>
        <h2 style={{fontSize:"1.5rem",marginBottom:"20px"}}>Shop by Category</h2>
        <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginBottom:"20px"}}>
          <button className={`cat-chip ${activeCategory==="all"?"active":""}`} onClick={()=>{setActiveCategory("all"); setActiveBrand("all");}}>✦ All</button>
          {catLoading ? Array(7).fill(0).map((_,i)=><div className="cat-skel" key={i}/>) :
            categories.map(c=>(
              <button key={c._id} className={`cat-chip ${activeCategory===c._id?"active":""}`} onClick={()=>{setActiveCategory(c._id); setActiveBrand("all");}}>{c.name}</button>
            ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"20px",flexWrap:"wrap",gap:"10px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <span>🔍</span>
          <input placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)} style={{padding:"8px 12px",border:"1px solid #ccc",borderRadius:"4px"}}/>
        </div>
        <span>Showing {products.length} products</span>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"8px 12px",border:"1px solid #ccc",borderRadius:"4px"}}>
          <option value="-ratingsAverage">⭐ Top Rated</option>
          <option value="price">💰 Price: Low to High</option>
          <option value="-price">💰 Price: High to Low</option>
          <option value="-sold">🔥 Most Popular</option>
        </select>
      </div>

      {/* Products Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"20px"}}>
        {loading ? Array(12).fill(0).map((_,i)=>(
          <div key={i} style={{border:"1px solid #e0e0e0",borderRadius:"8px",padding:"16px"}}>
            <Skel h={200} r={8}/>
            <Skel w="80%" h={20} style={{margin:"10px 0"}}/>
            <Skel w="60%" h={16}/>
          </div>
        )) : products.map(p=>(
          <div key={p._id} style={{border:"1px solid #e0e0e0",borderRadius:"8px",padding:"16px",display:"flex",flexDirection:"column"}}>
            <Link href={`/products/${p._id}`} style={{textDecoration:"none",color:"inherit"}}>
              <img src={p.imageCover} alt={p.title} style={{width:"100%",height:"200px",objectFit:"cover",borderRadius:"4px"}}/>
              <h3 style={{fontSize:"1.1rem",fontWeight:"600",margin:"10px 0"}}>{p.title}</h3>
            </Link>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"auto"}}>
              <div>
                <div style={{fontSize:"1.2rem",fontWeight:"bold"}}>{p.priceAfterDiscount??p.price} EGP</div>
                {p.priceAfterDiscount&&<div style={{fontSize:"0.9rem",color:"#888",textDecoration:"line-through"}}>{p.price} EGP</div>}
              </div>
              <MagBtn onClick={()=>handleAdd(p)} style={{padding:"8px 16px",background:"var(--g500)",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"}}>🛒</MagBtn>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{display:"flex",justifyContent:"center",gap:"10px",marginTop:"40px"}}>
          <button disabled={page===1} onClick={()=>setPage(p=>p-1)} style={{padding:"8px 16px",border:"1px solid #ccc",borderRadius:"4px",cursor:page===1?"not-allowed":"pointer"}}>Previous</button>
          {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)} style={{padding:"8px 16px",border:"1px solid #ccc",borderRadius:"4px",cursor:"pointer",background:page===p?"var(--g500)":"white",color:page===p?"white":"black"}}>{p}</button>
          ))}
          <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)} style={{padding:"8px 16px",border:"1px solid #ccc",borderRadius:"4px",cursor:page===totalPages?"not-allowed":"pointer"}}>Next</button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  );
}
