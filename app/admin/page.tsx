"use client";

import React,{ useState, useEffect } from "react";

const POLICY_ICONS = [
  "education","medical","environment","industry",
  "transport","reform","participation","childcare",
  "data","energy","digital"
];

interface Policy {
  icon: string;
  label: string;
  issue: string;
  solution: string;
  deadline: string;
  budget: string;
}

interface Candidate {
  id: string;
  electionId: string;
  name: string;
  party: string;
  tagline: string;
  message: string;
  profile: string;
  policies: Policy[];
}

interface Election {
  id: string;
  prefecture: string;
  city: string;
  name: string;
  type: string;
  announcementDate: string;
  electionDate: string;
  status: string;
}

function Icon({ type, size = 16, color = "#666" }: { type: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none" as const };
  const m: Record<string, JSX.Element> = {
    back:    <svg {...p}><path d="M12.5 5L7.5 10L12.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    plus:    <svg {...p}><path d="M10 4v12M4 10h12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    trash:   <svg {...p}><path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    save:    <svg {...p}><rect x="3" y="3" width="14" height="14" rx="1.5" stroke={color} strokeWidth="1.4"/><path d="M7 3v5h6V3M7 13h6" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    chevron: <svg {...p}><path d="M5 7.5L10 12.5L15 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    lock:    <svg {...p}><rect x="4" y="9" width="12" height="9" rx="1.5" stroke={color} strokeWidth="1.4"/><path d="M7 9V6a3 3 0 016 0v3" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>,
    logout:  <svg {...p}><path d="M13 10H4M7 7l-3 3 3 3M11 6V4h5v12h-5v-2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    edit:    <svg {...p}><path d="M14 3l3 3-9 9H5v-3L14 3Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  };
  return m[type] ?? null;
}

const F = {
  label: { fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", letterSpacing: "0.15em", display: "block", marginBottom: 5 } as React.CSSProperties,
  input: { width: "100%", padding: "9px 11px", fontSize: 12.5, fontFamily: "'Noto Sans JP', sans-serif", border: "1px solid #e0e0e0", borderRadius: 7, background: "#fafafa", color: "#1a1a1a", outline: "none", boxSizing: "border-box" } as React.CSSProperties,
  textarea: { width: "100%", padding: "9px 11px", fontSize: 12.5, fontFamily: "'Noto Serif JP', serif", border: "1px solid #e0e0e0", borderRadius: 7, background: "#fafafa", color: "#1a1a1a", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.8 } as React.CSSProperties,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}><span style={F.label}>{label}</span>{children}</div>;
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { if (msg) { const t = setTimeout(onDone, 2000); return () => clearTimeout(t); } }, [msg, onDone]);
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      background: "#1a1a1a", color: "#fff", borderRadius: 20,
      padding: "9px 18px", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif",
      zIndex: 999, boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
    }}>
      {msg}
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const attempt = async () => {
    const res = await fetch("/api/admin/elections", {
      headers: { "x-admin-password": pw },
    });
    if (res.ok) { onLogin(pw); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24></div>);}
      
function ElectionForm({ election, onSave, onCancel, onDelete }: {
  election: Election;
  onSave: (e: Election) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [data, setData] = useState({ ...election });
  const up = (k: keyof Election, v: string) => setData(d => ({ ...d, [k]: v }));

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 40px" }}>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 14 }}>選挙情報</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="都道府県"><input style={F.input} value={data.prefecture} onChange={e => up("prefecture", e.target.value)} placeholder="例：東京都" /></Field>
          <Field label="市区町村"><input style={F.input} value={data.city} onChange={e => up("city", e.target.value)} placeholder="例：世田谷区" /></Field>
        </div>
        <Field label="選挙名"><input style={F.input} value={data.name} onChange={e => up("name", e.target.value)} placeholder="例：世田谷区議会議員選挙" /></Field>
        <Field label="種別"><input style={F.input} value={data.type} onChange={e => up("type", e.target.value)} placeholder="例：市議会議員" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="告示日"><input style={F.input} type="date" value={data.announcementDate} onChange={e => up("announcementDate", e.target.value)} /></Field>
          <Field label="投票日"><input style={F.input} type="date" value={data.electionDate} onChange={e => up("electionDate", e.target.value)} /></Field>
        </div>
        <Field label="ステータス">
          <select style={{ ...F.input, appearance: "none" } as React.CSSProperties} value={data.status} onChange={e => up("status", e.target.value)}>
            <option value="upcoming">upcoming（予定）</option>
            <option value="ongoing">ongoing（開催中）</option>
            <option value="past">past（終了）</option>
          </select>
        </Field>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onSave(data)} style={{
          flex: 1, padding: 12, background: "#1a1a}}}>
            </div>
            

