"use client";
import { useState, useEffect } from "react";
import { Brand } from "@/types";
import Link from "next/link";

const API = "https://ecommerce.routemisr.com/api/v1";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/brands`)
      .then(r => r.json())
      .then(d => {
        setBrands(d.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "80vh", padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", marginBottom: "40px", textAlign: "center" }}>
        Our Brands
      </h1>
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} style={{ height: "150px", background: "#f0f0f0", borderRadius: "8px" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {brands.map(brand => (
            <Link key={brand._id} href={`/products?brand=${brand._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                transition: "box-shadow 0.2s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                {brand.image && <img src={brand.image} alt={brand.name} style={{ width: "100px", height: "100px", objectFit: "contain", marginBottom: "10px" }} />}
                <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>{brand.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}