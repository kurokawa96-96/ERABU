"use client";

import React, { useState, useEffect } from "react";

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
  const m: Record<string, React.ReactElement> = {
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

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 11px", fontSize: 12.5,
  fontFamily: "'Noto Sans JP', sans-serif", border: "1px solid #e0e0e0",
  borderRadius: 7, background: "#fafafa", color: "#1a1a1a",
  outline: "none", boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%", padding: "9px 11px", fontSize: 12.5,
  fontFamily: "'Noto Serif JP', serif", border: "1px solid #e0e0e0",
  borderRadius: 7, background: "#fafafa", color: "#1a1a1a",
  outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif",
  color: "#aaa", letterSpacing: "0.15em", display: "block", marginBottom: 5,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}><span style={labelStyle}>{label}</span>{children}</div>;
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
    <div style={{ minHeight: "100vh", background: "#f5f4f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 26, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.25em", color: "#1a1a1a", marginBottom: 6 }}>ERABU</div>
        <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em" }}>ADMIN</div>
      </div>
      <div style={{ width: "100%", maxWidth: 300, background: "#fff", borderRadius: 14, border: "1px solid #ebebeb", padding: "24px 22px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Icon type="lock" size={28} color="#ccc" />
        </div>
        <Field label="パスワード">
          <input
            type="password" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            style={{ ...inputStyle, borderColor: err ? "#e07070" : "#e0e0e0" }}
            placeholder="••••••••" autoFocus
          />
        </Field>
        {err && <div style={{ fontSize: 11, color: "#e07070", textAlign: "center", marginBottom: 12, fontFamily: "'Noto Sans JP', sans-serif" }}>パスワードが違います</div>}
        <button onClick={attempt} style={{
          width: "100%", padding: 11, background: "#1a1a1a",
          color: "#fff", border: "none", borderRadius: 9,
          fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer",
        }}>ログイン</button>
      </div>
    </div>
  );
}
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
          <Field label="都道府県"><input style={inputStyle} value={data.prefecture} onChange={e => up("prefecture", e.target.value)} placeholder="例：東京都" /></Field>
          <Field label="市区町村"><input style={inputStyle} value={data.city} onChange={e => up("city", e.target.value)} placeholder="例：世田谷区" /></Field>
        </div>
        <Field label="選挙名"><input style={inputStyle} value={data.name} onChange={e => up("name", e.target.value)} placeholder="例：世田谷区議会議員選挙" /></Field>
        <Field label="種別"><input style={inputStyle} value={data.type} onChange={e => up("type", e.target.value)} placeholder="例：市議会議員" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="告示日"><input style={inputStyle} type="date" value={data.announcementDate} onChange={e => up("announcementDate", e.target.value)} /></Field>
          <Field label="投票日"><input style={inputStyle} type="date" value={data.electionDate} onChange={e => up("electionDate", e.target.value)} /></Field>
        </div>
        <Field label="ステータス">
          <select style={{ ...inputStyle, appearance: "none" }} value={data.status} onChange={e => up("status", e.target.value)}>
            <option value="upcoming">upcoming（予定）</option>
            <option value="ongoing">ongoing（開催中）</option>
            <option value="past">past（終了）</option>
          </select>
        </Field>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onSave(data)} style={{
          flex: 1, padding: 12, background: "#1a1a1a", color: "#fff",
          border: "none", borderRadius: 9, fontSize: 13,
          fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}>
          <Icon type="save" size={14} color="#fff" /> 保存する
        </button>
        <button onClick={onCancel} style={{
          padding: "12px 16px", background: "none",
          border: "1px solid #e0e0e0", borderRadius: 9,
          fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif",
          color: "#888", cursor: "pointer",
        }}>戻る</button>
      </div>

      {onDelete && (
        <button onClick={onDelete} style={{
          width: "100%", marginTop: 10, padding: 10, background: "none",
          border: "1px solid #f0d0d0", borderRadius: 9, color: "#c07070",
          fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer",
        }}>この選挙を削除する</button>
      )}
    </div>
  );
}

function ElectionsTab({ password, onToast }: { password: string; onToast: (m: string) => void }) {
  const [elections, setElections] = useState<Election[]>([]);
  const [sha, setSha] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/elections", { headers: { "x-admin-password": password } })
      .then(r => r.json())
      .then(d => { setElections(d.data); setSha(d.sha); });
  }, [password]);

  const save = async (el: Election) => {
    const next = elections.map(e => e.id === el.id ? el : e);
    await fetch("/api/admin/elections", {
      method: "POST",
      headers: { "x-admin-password": password, "Content-Type": "application/json" },
      body: JSON.stringify({ elections: next, sha }),
    });
    setElections(next);
    setEditing(null);
    onToast("保存しました");
  };

  const add = () => {
    const fresh: Election = {
      id: `e${Date.now()}`, prefecture: "", city: "", name: "",
      type: "", announcementDate: "", electionDate: "", status: "upcoming",
    };
    setElections(p => [...p, fresh]);
    setEditing(fresh.id);
  };

  const remove = async (id: string) => {
    const next = elections.filter(e => e.id !== id);
    await fetch("/api/admin/elections", {
      method: "POST",
      headers: { "x-admin-password": password, "Content-Type": "application/json" },
      body: JSON.stringify({ elections: next, sha }),
    });
    setElections(next);
    setEditing(null);
    onToast("削除しました");
  };

  if (editing) {
    const el = elections.find(e => e.id === editing)!;
    return (
      <>
        <div style={{ padding: "14px 16px", background: "#fff", borderBottom: "1px solid #ebebeb", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Icon type="back" size={18} color="#1a1a1a" />
          </button>
          <span style={{ fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a" }}>
            {el.name || "新しい選挙"}
          </span>
        </div>
        <ElectionForm election={el} onSave={save} onCancel={() => setEditing(null)} onDelete={() => remove(el.id)} />
      </>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em" }}>{elections.length}件登録中</div>
        <button onClick={add} style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "7px 13px", background: "#1a1a1a", border: "none",
          borderRadius: 8, color: "#fff", fontSize: 11.5,
          fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer",
        }}>
          <Icon type="plus" size={13} color="#fff" /> 選挙を追加
        </button>
      </div>
      {elections.map(el => (
        <button key={el.id} onClick={() => setEditing(el.id)} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", background: "#fff", border: "1px solid #ebebeb",
          borderRadius: 11, marginBottom: 8, cursor: "pointer", textAlign: "left",
        }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", marginBottom: 2 }}>
              {el.prefecture} {el.city}
            </div>
            <div style={{ fontSize: 14, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a" }}>
              {el.name || "名称未設定"}
            </div>
            <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", marginTop: 2 }}>
              投票日 {el.electionDate}
            </div>
          </div>
          <Icon type="edit" size={14} color="#ccc" />
        </button>
      ))}
    </div>
  );
}

const TABS = [
  { id: "elections", label: "選挙" },
  { id: "candidates", label: "候補者" },
];

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("elections");
  const [toast, setToast] = useState("");

  if (!auth) return <LoginScreen onLogin={pw => { setPassword(pw); setAuth(true); }} />;

  return (
    <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: "#f5f4f0", display: "flex", flexDirection: "column" }}>
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8e8e8",
        padding: "0 16px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div>
          <span style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em", color: "#1a1a1a" }}>ERABU</span>
          <span style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.2em", marginLeft: 8 }}>ADMIN</span>
        </div>
        <button onClick={() => setAuth(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Icon type="logout" size={16} color="#bbb" />
        </button>
      </div>

      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #e8e8e8", flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "12px 4px",
            background: "none", border: "none", cursor: "pointer",
            borderBottom: tab === t.id ? "2px solid #1a1a1a" : "2px solid transparent",
            fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif",
            color: tab === t.id ? "#1a1a1a" : "#bbb",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {tab === "elections" && <ElectionsTab password={password} onToast={setToast} />}
        {tab === "candidates" && (
          <div style={{ padding: 24, textAlign: "center", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb" }}>
            候補者管理は次のステップで追加しますわ
          </div>
        )}
      </div>

      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}
