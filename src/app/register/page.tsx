"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { RegisterData } from "@/types";
const API = "https://ecommerce.routemisr.com/api/v1";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form,setForm]=useState<RegisterData>({name:"",email:"",password:"",rePassword:"",phone:""});
  const [errors,setErrors]=useState<Partial<RegisterData>>({});
  const [loading,setLoading]=useState(false);
  const [showPass,setShowPass]=useState(false);

  function validate(){
    const e:Partial<RegisterData>={};
    if(!form.name||form.name.length<3) e.name="Min 3 characters";
    if(!form.email||!/\S+@\S+\.\S+/.test(form.email)) e.email="Valid email required";
    if(!form.password||form.password.length<6) e.password="Min 6 characters";
    if(form.password!==form.rePassword) e.rePassword="Passwords don't match";
    if(!form.phone||!/^01[0125][0-9]{8}$/.test(form.phone)) e.phone="Valid Egyptian phone required";
    setErrors(e); return !Object.keys(e).length;
  }

  async function handleSubmit(e:FormEvent){
    e.preventDefault(); if(!validate()) return;
    setLoading(true);
    try {
      const res=await fetch(`${API}/auth/signup`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data=await res.json();
      if(data.message==="success"){showToast("Account created! Sign in now 🎉");router.push("/login");}
      else showToast(data.errors?.msg||data.message||"Registration failed","error");
    } catch {showToast("Network error","error");}
    finally{setLoading(false);}
  }

  const strength=[form.password.length>=6,/[A-Z]/.test(form.password),/[0-9]/.test(form.password),/[^a-zA-Z0-9]/.test(form.password)].filter(Boolean).length;
  const strengthColors=["","#ef4444","#f59e0b","#4ade80","#16a34a"];

  return (
    <>
      <style>{`
        .auth-wrap{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;}
        .auth-left{background:linear-gradient(160deg,var(--g600),var(--g800));display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;position:relative;overflow:hidden;}
        .auth-left-blob{position:absolute;border-radius:50%;opacity:0.12;animation:borderDance 10s ease-in-out infinite;}
        .auth-brand{font-family:var(--font-display);font-size:3rem;font-weight:700;color:#fff;font-style:italic;margin-bottom:12px;}
        .auth-brand-sub{color:rgba(255,255,255,0.65);font-size:1rem;max-width:300px;text-align:center;line-height:1.7;font-weight:500;}
        .auth-steps{display:flex;flex-direction:column;gap:16px;margin-top:40px;width:100%;max-width:280px;}
        .auth-step{display:flex;align-items:center;gap:14px;color:#fff;font-size:0.88rem;font-weight:600;}
        .step-num{width:30px;height:30px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:700;flex-shrink:0;}
        .auth-right{background:var(--bg);display:flex;align-items:center;justify-content:center;padding:50px 40px;}
        .auth-form-box{width:100%;max-width:430px;animation:fadeUp 0.5s ease both;}
        .auth-title{font-family:var(--font-display);font-size:2.2rem;font-weight:700;color:var(--text);margin-bottom:6px;font-style:italic;}
        .auth-sub{color:var(--muted);font-size:0.9rem;font-weight:500;margin-bottom:30px;}
        .fields-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
        .field-full{grid-column:1/-1;}
        .field-lbl{display:block;font-size:0.83rem;font-weight:700;color:var(--text2);margin-bottom:6px;}
        .pass-wrap{position:relative;}
        .pass-wrap .input-base{padding-right:46px;}
        .eye-btn{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--muted);cursor:pointer;font-size:0.95rem;padding:4px;transition:color 0.2s;}
        .eye-btn:hover{color:var(--g600);}
        .strength-bar{display:flex;gap:4px;margin-top:8px;}
        .s-seg{flex:1;height:3px;border-radius:2px;background:var(--border);transition:background 0.3s;}
        .auth-terms{text-align:center;color:var(--muted);font-size:0.76rem;margin-top:12px;line-height:1.6;}
        .auth-terms a{color:var(--g600);text-decoration:none;}
        .auth-switch{text-align:center;margin-top:18px;color:var(--muted);font-size:0.88rem;font-weight:500;}
        .auth-switch a{color:var(--g600);font-weight:700;text-decoration:none;}
        @media(max-width:768px){.auth-wrap{grid-template-columns:1fr;}.auth-left{display:none;}.fields-grid{grid-template-columns:1fr;}}
      `}</style>

      <div className="auth-wrap">
        <div className="auth-left">
          <div className="auth-left-blob" style={{width:380,height:380,background:"rgba(255,255,255,0.1)",top:-80,right:-80}}/>
          <div className="auth-left-blob" style={{width:220,height:220,background:"rgba(255,255,255,0.08)",bottom:-40,left:-50,animationDelay:"4s"}}/>
          <div className="auth-brand">FreshCart</div>
          <p className="auth-brand-sub">Join 50K+ happy customers getting fresh groceries delivered daily.</p>
          <div className="auth-steps">
            {[["1","Create your account"],["2","Browse fresh products"],["3","Get it delivered fast"]].map(([n,t])=>(
              <div className="auth-step" key={n}><span className="step-num">{n}</span>{t}</div>
            ))}
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-box">
            <h1 className="auth-title">Create account</h1>
            <p className="auth-sub">Start your fresh journey today</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="fields-grid">
                <div className="field-full">
                  <label className="field-lbl">Full Name</label>
                  <input className={`input-base ${errors.name?"error":""}`} type="text" placeholder="Ahmed Mohamed" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
                  {errors.name&&<div className="field-error">⚠ {errors.name}</div>}
                </div>
                <div className="field-full">
                  <label className="field-lbl">Email</label>
                  <input className={`input-base ${errors.email?"error":""}`} type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
                  {errors.email&&<div className="field-error">⚠ {errors.email}</div>}
                </div>
                <div className="field-full">
                  <label className="field-lbl">Phone Number</label>
                  <input className={`input-base ${errors.phone?"error":""}`} type="tel" placeholder="01012345678" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/>
                  {errors.phone&&<div className="field-error">⚠ {errors.phone}</div>}
                </div>
                <div>
                  <label className="field-lbl">Password</label>
                  <div className="pass-wrap">
                    <input className={`input-base ${errors.password?"error":""}`} type={showPass?"text":"password"} placeholder="Min 6 chars" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
                    <button type="button" className="eye-btn" onClick={()=>setShowPass(s=>!s)}>{showPass?"🙈":"👁"}</button>
                  </div>
                  {form.password&&<div className="strength-bar">{[1,2,3,4].map(i=><div key={i} className="s-seg" style={{background:i<=strength?strengthColors[strength]:undefined}}/>)}</div>}
                  {errors.password&&<div className="field-error">⚠ {errors.password}</div>}
                </div>
                <div>
                  <label className="field-lbl">Confirm Password</label>
                  <input className={`input-base ${errors.rePassword?"error":""}`} type="password" placeholder="Repeat" value={form.rePassword} onChange={e=>setForm(f=>({...f,rePassword:e.target.value}))}/>
                  {errors.rePassword&&<div className="field-error">⚠ {errors.rePassword}</div>}
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{marginTop:20}}>
                {loading?<><span className="spinner-white"/>Creating…</>:"Create Account →"}
              </button>
            </form>

            <p className="auth-terms">By signing up you agree to our <a href="#">Terms</a> & <a href="#">Privacy</a></p>
            <div className="auth-switch">Already have an account? <Link href="/login">Sign in →</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}
