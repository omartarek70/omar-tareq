"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ToastProvider";

const API = "https://ecommerce.routemisr.com/api/v1";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email?:string;password?:string}>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function validate() {
    const e:{email?:string;password?:string}={};
    if(!email) e.email="Email is required";
    else if(!/\S+@\S+\.\S+/.test(email)) e.email="Invalid email";
    if(!password||password.length<6) e.password="At least 6 characters";
    setErrors(e); return !Object.keys(e).length;
  }

  async function handleSubmit(e:FormEvent) {
    e.preventDefault(); if(!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/signin`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      const data = await res.json();
      if(data.message==="success"){login(data.token,data.user);showToast(`Welcome back, ${data.user.name}! 🌿`);router.push("/");}
      else showToast(data.message||"Invalid credentials","error");
    } catch { showToast("Network error","error"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <style>{`
        .auth-wrap { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; }
        .auth-left {
          background:linear-gradient(160deg,var(--g600),var(--g800));
          display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px;
          position:relative; overflow:hidden;
        }
        .auth-left-blob { position:absolute; border-radius:50%; opacity:0.15; animation:borderDance 10s ease-in-out infinite; }
        .auth-brand { font-family:var(--font-display); font-size:3rem; font-weight:700; color:#fff; font-style:italic; margin-bottom:12px; }
        .auth-brand-sub { color:rgba(255,255,255,0.65); font-size:1rem; font-weight:500; max-width:300px; text-align:center; line-height:1.7; }
        .auth-left-icons { display:flex; gap:18px; margin-top:40px; }
        .auth-icon { font-size:2.5rem; animation:floatY 5s ease-in-out infinite; filter:drop-shadow(0 6px 12px rgba(0,0,0,0.2)); }
        .auth-icon:nth-child(2){animation-delay:1.5s;}
        .auth-icon:nth-child(3){animation-delay:3s;}
        .auth-right { background:var(--bg); display:flex; align-items:center; justify-content:center; padding:60px 40px; }
        .auth-form-box { width:100%; max-width:420px; animation:fadeUp 0.5s ease both; }
        .auth-title { font-family:var(--font-display); font-size:2.4rem; font-weight:700; color:var(--text); margin-bottom:6px; font-style:italic; }
        .auth-sub { color:var(--muted); font-size:0.92rem; font-weight:500; margin-bottom:36px; }
        .field-wrap { margin-bottom:18px; }
        .field-lbl { display:block; font-size:0.84rem; font-weight:700; color:var(--text2); margin-bottom:7px; }
        .pass-wrap { position:relative; }
        .pass-wrap .input-base { padding-right:46px; }
        .eye-btn { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--muted); cursor:pointer; font-size:0.95rem; padding:4px; transition:color 0.2s; }
        .eye-btn:hover { color:var(--g600); }
        .forgot { color:var(--muted); text-decoration:none; font-size:0.8rem; font-weight:600; float:right; transition:color 0.2s; }
        .forgot:hover { color:var(--g600); }
        .auth-divider { display:flex; align-items:center; gap:12px; color:var(--muted); font-size:0.8rem; margin:20px 0; }
        .auth-divider::before,.auth-divider::after { content:''; flex:1; height:1px; background:var(--border); }
        .demo-box { background:var(--g50); border:1.5px solid var(--g200); border-radius:14px; padding:14px 16px; font-size:0.8rem; color:var(--muted); }
        .demo-box b { color:var(--g700); }
        .auth-switch { text-align:center; margin-top:22px; color:var(--muted); font-size:0.88rem; font-weight:500; }
        .auth-switch a { color:var(--g600); font-weight:700; text-decoration:none; }
        .auth-switch a:hover { text-decoration:underline; }
        @media(max-width:768px){ .auth-wrap{grid-template-columns:1fr;} .auth-left{display:none;} }
      `}</style>

      <div className="auth-wrap">
        {/* Left decorative panel */}
        <div className="auth-left">
          <div className="auth-left-blob" style={{width:400,height:400,background:"rgba(255,255,255,0.1)",top:-100,right:-100}}/>
          <div className="auth-left-blob" style={{width:250,height:250,background:"rgba(255,255,255,0.08)",bottom:-50,left:-60,animationDelay:"4s"}}/>
          <div className="auth-brand">FreshCart</div>
          <p className="auth-brand-sub">Your daily dose of fresh — groceries and essentials delivered in minutes.</p>
          <div className="auth-left-icons">
            <span className="auth-icon">🥑</span>
            <span className="auth-icon">🛒</span>
            <span className="auth-icon">🥦</span>
          </div>
        </div>

        {/* Right form panel */}
        <div className="auth-right">
          <div className="auth-form-box">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Sign in to continue shopping</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field-wrap">
                <label className="field-lbl">Email</label>
                <input className={`input-base ${errors.email?"error":""}`} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/>
                {errors.email&&<div className="field-error">⚠ {errors.email}</div>}
              </div>
              <div className="field-wrap">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <label className="field-lbl" style={{marginBottom:0}}>Password</label>
                  <Link href="/forgot-password" className="forgot">Forgot?</Link>
                </div>
                <div className="pass-wrap">
                  <input className={`input-base ${errors.password?"error":""}`} type={showPass?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}/>
                  <button type="button" className="eye-btn" onClick={()=>setShowPass(s=>!s)}>{showPass?"🙈":"👁"}</button>
                </div>
                {errors.password&&<div className="field-error">⚠ {errors.password}</div>}
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{marginTop:8}}>
                {loading?<><span className="spinner-white"/>Signing in…</>:"Sign In →"}
              </button>
            </form>

            <div className="auth-divider">demo account</div>
            <div className="demo-box">
              Email: <b>ahmed.ahmed11@gmail.com</b><br/>
              Pass: <b>Ahmed@1234</b>
            </div>

            <div className="auth-switch">Don't have an account? <Link href="/register">Create one →</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}
