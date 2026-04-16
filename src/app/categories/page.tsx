"use client";
import { useState, useEffect } from "react";
import { Category } from "@/types";
import Link from "next/link";

const API = "https://ecommerce.routemisr.com/api/v1";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(d => {
        setCategories(d.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "80vh", padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", marginBottom: "40px", textAlign: "center" }}>
        Shop by Category
      </h1>
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} style={{ height: "150px", background: "#f0f0f0", borderRadius: "8px" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {categories.map(category => (
            <Link key={category._id} href={`/products?category=${category._id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
                {category.image && <img src={category.image} alt={category.name} style={{ width: "100px", height: "100px", objectFit: "contain", marginBottom: "10px" }} />}
                <h3 style={{ fontSize: "1.2rem", fontWeight: "600" }}>{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}