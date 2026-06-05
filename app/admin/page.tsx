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

interface BillVote {
  bill: string;
  category: string;
  vote: string;
  date: string;
}

interface IncumbentPromise {
  title: string;
  status: "達成" | "進行中" | "未着手" | "変更";
  evidence: string;
}

interface ActivityReport {
  date: string;
  title: string;
  summary: string;
}

interface Incumbent {
  id: string;
  name: string;
  party: string;
  prefecture: string;
  city: string;
  assembly: string;
  term: string;
  tagline: string;
  message: string;
  attendanceRate: number;
  speechCount: number;
  questionCount: number;
  billVotes: BillVote[];
  promises: IncumbentPromise[];
  activityReports: ActivityReport[];
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
function PolicyForm({ policy, onChange, onRemove, index }: {
 policy: Policy;
 onChange: (p: Policy) => void;
 onRemove: () => void;
 index: number;
}) {
 const [open, setOpen] = useState(false);
 const up = (k: keyof Policy, v: string) => onChange({ ...policy, [k]: v });

 return (
   <div style={{ border: "1px solid #e8e8e8", borderRadius: 10, marginBottom: 8, overflow: "hidden" }}>
     <button onClick={() => setOpen(!open)} style={{
       width: "100%", padding: "12px 14px",
       display: "flex", alignItems: "center", justifyContent: "space-between",
       background: open ? "#fafaf8" : "#fff", border: "none", cursor: "pointer",
     }}>
       <span style={{ fontSize: 12.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", fontWeight: 600 }}>
         {policy.label || `政策 ${index + 1}`}
       </span>
       <div style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
         <Icon type="chevron" size={14} color="#bbb" />
       </div>
     </button>
     {open && (
       <div style={{ padding: "14px 14px 16px", borderTop: "1px solid #f0f0f0" }}>
         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
           <Field label="政策名">
             <input style={inputStyle} value={policy.label} onChange={e => up("label", e.target.value)} placeholder="例：教育無償化" />
           </Field>
           <Field label="アイコン">
             <select style={{ ...inputStyle, appearance: "none" }} value={policy.icon} onChange={e => up("icon", e.target.value)}>
               {POLICY_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
             </select>
           </Field>
         </div>
         {(["issue", "solution", "deadline", "budget"] as const).map(key => (
           <Field key={key} label={key === "issue" ? "課題" : key === "solution" ? "解決策" : key === "deadline" ? "期限" : "財源・根拠"}>
             <textarea
               style={{ ...textareaStyle, minHeight: key === "issue" || key === "solution" ? 72 : 48 }}
               value={policy[key]}
               onChange={e => up(key, e.target.value)}
             />
           </Field>
         ))}
         <button onClick={onRemove} style={{
           display: "flex", alignItems: "center", gap: 5,
           padding: "6px 10px", background: "none",
           border: "1px solid #f0d0d0", borderRadius: 7,
           color: "#c07070", fontSize: 11,
           fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer",
         }}>
           <Icon type="trash" size={12} color="#c07070" /> この政策を削除
         </button>
       </div>
     )}
   </div>
 );
}

function CandidateForm({ candidate, elections, onSave, onCancel, onDelete }: {
 candidate: Candidate;
 elections: Election[];
 onSave: (c: Candidate) => void;
 onCancel: () => void;
 onDelete?: () => void;
}) {
 const [data, setData] = useState({ ...candidate });
 const up = (k: keyof Candidate, v: string) => setData(d => ({ ...d, [k]: v }));

 const addPolicy = () => setData(d => ({
   ...d, policies: [...d.policies, { icon: "education", label: "", issue: "", solution: "", deadline: "", budget: "" }]
 }));

 const updatePolicy = (i: number, val: Policy) => setData(d => ({
   ...d, policies: d.policies.map((p, idx) => idx === i ? val : p)
 }));

 const removePolicy = (i: number) => setData(d => ({
   ...d, policies: d.policies.filter((_, idx) => idx !== i)
 }));

 return (
   <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 40px" }}>
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 14 }}>基本情報</div>
       <Field label="選挙">
         <select style={{ ...inputStyle, appearance: "none" }} value={data.electionId} onChange={e => up("electionId", e.target.value)}>
           <option value="">選択してください</option>
           {elections.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
         </select>
       </Field>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
         <Field label="氏名"><input style={inputStyle} value={data.name} onChange={e => up("name", e.target.value)} /></Field>
         <Field label="所属政党"><input style={inputStyle} value={data.party} onChange={e => up("party", e.target.value)} /></Field>
       </div>
       <Field label="タグライン">
         <input style={inputStyle} value={data.tagline} onChange={e => up("tagline", e.target.value)} />
       </Field>
       <Field label="メッセージ">
         <textarea style={{ ...textareaStyle, minHeight: 72 }} value={data.message} onChange={e => up("message", e.target.value)} />
       </Field>
       <Field label="経歴">
         <textarea style={{ ...textareaStyle, minHeight: 60 }} value={data.profile} onChange={e => up("profile", e.target.value)} />
       </Field>
     </div>

     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
         <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em" }}>政策</div>
         <button onClick={addPolicy} style={{
           display: "flex", alignItems: "center", gap: 4,
           padding: "5px 10px", background: "#f5f4f0",
           border: "1px solid #e0e0e0", borderRadius: 7,
           fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif",
           color: "#555", cursor: "pointer",
         }}>
           <Icon type="plus" size={12} color="#555" /> 追加
         </button>
       </div>
       {data.policies.map((p, i) => (
         <PolicyForm key={i} policy={p} index={i}
           onChange={val => updatePolicy(i, val)}
           onRemove={() => removePolicy(i)}
         />
       ))}
       {data.policies.length === 0 && (
         <div style={{ textAlign: "center", padding: "20px 0", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#ccc" }}>
           政策がありません
         </div>
       )}
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
       }}>この候補者を削除する</button>
     )}
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
function IncumbentForm({ incumbent, onSave, onCancel, onDelete }: {
 incumbent: Incumbent;
 onSave: (inc: Incumbent) => void;
 onCancel: () => void;
 onDelete?: () => void;
}) {
 const [data, setData] = useState({ ...incumbent });
 const up = (k: keyof Incumbent, v: string | number) => setData(d => ({ ...d, [k]: v }));

 const addPromise = () => setData(d => ({
   ...d, promises: [...d.promises, { title: "", status: "未着手" as const, evidence: "" }]
 }));

 const updatePromise = (i: number, key: keyof IncumbentPromise, v: string) =>
   setData(d => ({ ...d, promises: d.promises.map((p, idx) => idx === i ? { ...p, [key]: v } : p) }));

 const removePromise = (i: number) =>
   setData(d => ({ ...d, promises: d.promises.filter((_, idx) => idx !== i) }));

 const addReport = () => setData(d => ({
   ...d, activityReports: [...d.activityReports, { date: "", title: "", summary: "" }]
 }));

 const updateReport = (i: number, key: keyof ActivityReport, v: string) =>
   setData(d => ({ ...d, activityReports: d.activityReports.map((r, idx) => idx === i ? { ...r, [key]: v } : r) }));

 const removeReport = (i: number) =>
   setData(d => ({ ...d, activityReports: d.activityReports.filter((_, idx) => idx !== i) }));

 const addVote = () => setData(d => ({
   ...d, billVotes: [...d.billVotes, { bill: "", category: "", vote: "賛成", date: "" }]
 }));

 const updateVote = (i: number, key: keyof BillVote, v: string) =>
   setData(d => ({ ...d, billVotes: d.billVotes.map((v2, idx) => idx === i ? { ...v2, [key]: v } : v2) }));

 const removeVote = (i: number) =>
   setData(d => ({ ...d, billVotes: d.billVotes.filter((_, idx) => idx !== i) }));

 return (
   <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 40px" }}>

     {/* 基本情報 */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 14 }}>基本情報</div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
         <Field label="都道府県"><input style={inputStyle} value={data.prefecture} onChange={e => up("prefecture", e.target.value)} placeholder="例：東京都" /></Field>
         <Field label="市区町村"><input style={inputStyle} value={data.city} onChange={e => up("city", e.target.value)} placeholder="例：中野区" /></Field>
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
         <Field label="氏名"><input style={inputStyle} value={data.name} onChange={e => up("name", e.target.value)} /></Field>
         <Field label="所属政党"><input style={inputStyle} value={data.party} onChange={e => up("party", e.target.value)} /></Field>
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
         <Field label="役職"><input style={inputStyle} value={data.assembly} onChange={e => up("assembly", e.target.value)} placeholder="例：中野区長" /></Field>
         <Field label="任期"><input style={inputStyle} value={data.term} onChange={e => up("term", e.target.value)} placeholder="例：2018年 - 現在" /></Field>
       </div>
     </div>

     {/* 理念・メッセージ */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 14 }}>理念・メッセージ</div>
       <Field label="タグライン">
         <input style={inputStyle} value={data.tagline} onChange={e => up("tagline", e.target.value)} placeholder="例：区民とともに、中野の未来をつくる" />
       </Field>
       <Field label="メッセージ">
         <textarea style={{ ...textareaStyle, minHeight: 80 }} value={data.message} onChange={e => up("message", e.target.value)} />
       </Field>
     </div>

     {/* 公約 */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
         <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em" }}>公約</div>
         <button onClick={addPromise} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "#f5f4f0", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", cursor: "pointer" }}>
           <Icon type="plus" size={12} color="#555" /> 追加
         </button>
       </div>
       {data.promises.map((p, i) => (
         <div key={i} style={{ border: "1px solid #e8e8e8", borderRadius: 9, padding: "12px", marginBottom: 8 }}>
           <Field label="公約タイトル"><input style={inputStyle} value={p.title} onChange={e => updatePromise(i, "title", e.target.value)} /></Field>
           <Field label="達成状況">
             <select style={{ ...inputStyle, appearance: "none" }} value={p.status} onChange={e => updatePromise(i, "status", e.target.value)}>
               <option value="未着手">未着手</option>
               <option value="進行中">進行中</option>
               <option value="達成">達成</option>
               <option value="変更">変更</option>
             </select>
           </Field>
           <Field label="根拠・コメント"><textarea style={{ ...textareaStyle, minHeight: 60 }} value={p.evidence} onChange={e => updatePromise(i, "evidence", e.target.value)} /></Field>
           <button onClick={() => removePromise(i)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "none", border: "1px solid #f0d0d0", borderRadius: 7, color: "#c07070", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
             <Icon type="trash" size={12} color="#c07070" /> 削除
           </button>
         </div>
       ))}
     </div>

     {/* 活動記録 */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 14 }}>議会活動記録</div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
         <Field label="出席率(%)"><input style={inputStyle} type="number" value={data.attendanceRate} onChange={e => up("attendanceRate", Number(e.target.value))} /></Field>
         <Field label="発言回数"><input style={inputStyle} type="number" value={data.speechCount} onChange={e => up("speechCount", Number(e.target.value))} /></Field>
         <Field label="質問回数"><input style={inputStyle} type="number" value={data.questionCount} onChange={e => up("questionCount", Number(e.target.value))} /></Field>
       </div>
     </div>

     {/* 賛否記録 */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
         <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em" }}>賛否記録</div>
         <button onClick={addVote} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "#f5f4f0", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", cursor: "pointer" }}>
           <Icon type="plus" size={12} color="#555" /> 追加
         </button>
       </div>
       {data.billVotes.map((v, i) => (
         <div key={i} style={{ border: "1px solid #e8e8e8", borderRadius: 9, padding: "12px", marginBottom: 8 }}>
           <Field label="議案名"><input style={inputStyle} value={v.bill} onChange={e => updateVote(i, "bill", e.target.value)} /></Field>
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
             <Field label="カテゴリ"><input style={inputStyle} value={v.category} onChange={e => updateVote(i, "category", e.target.value)} /></Field>
             <Field label="賛否">
               <select style={{ ...inputStyle, appearance: "none" }} value={v.vote} onChange={e => updateVote(i, "vote", e.target.value)}>
                 <option value="賛成">賛成</option>
                 <option value="反対">反対</option>
                 <option value="棄権">棄権</option>
               </select>
             </Field>
             <Field label="日付"><input style={inputStyle} type="date" value={v.date} onChange={e => updateVote(i, "date", e.target.value)} /></Field>
           </div>
           <button onClick={() => removeVote(i)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "none", border: "1px solid #f0d0d0", borderRadius: 7, color: "#c07070", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
             <Icon type="trash" size={12} color="#c07070" /> 削除
           </button>
         </div>
       ))}
     </div>

     {/* 活動報告 */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
         <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em" }}>活動報告</div>
         <button onClick={addReport} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "#f5f4f0", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", cursor: "pointer" }}>
           <Icon type="plus" size={12} color="#555" /> 追加
         </button>
       </div>
       {data.activityReports.map((r, i) => (
         <div key={i} style={{ border: "1px solid #e8e8e8", borderRadius: 9, padding: "12px", marginBottom: 8 }}>
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
             <Field label="日付"><input style={inputStyle} type="date" value={r.date} onChange={e => updateReport(i, "date", e.target.value)} /></Field>
             <Field label="タイトル"><input style={inputStyle} value={r.title} onChange={e => updateReport(i, "title", e.target.value)} /></Field>
           </div>
           <Field label="内容"><textarea style={{ ...textareaStyle, minHeight: 60 }} value={r.summary} onChange={e => updateReport(i, "summary", e.target.value)} /></Field>
           <button onClick={() => removeReport(i)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "none", border: "1px solid #f0d0d0", borderRadius: 7, color: "#c07070", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
             <Icon type="trash" size={12} color="#c07070" /> 削除
           </button>
         </div>
       ))}
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
       }}>この現職議員を削除する</button>
     )}
   </div>
 );
}
function IncumbentForm({ incumbent, onSave, onCancel, onDelete }: {
 incumbent: Incumbent;
 onSave: (inc: Incumbent) => void;
 onCancel: () => void;
 onDelete?: () => void;
}) {
 const [data, setData] = useState({ ...incumbent });
 const up = (k: keyof Incumbent, v: string | number) => setData(d => ({ ...d, [k]: v }));

 const addPromise = () => setData(d => ({
   ...d, promises: [...d.promises, { title: "", status: "未着手" as const, evidence: "" }]
 }));

 const updatePromise = (i: number, key: keyof IncumbentPromise, v: string) =>
   setData(d => ({ ...d, promises: d.promises.map((p, idx) => idx === i ? { ...p, [key]: v } : p) }));

 const removePromise = (i: number) =>
   setData(d => ({ ...d, promises: d.promises.filter((_, idx) => idx !== i) }));

 const addReport = () => setData(d => ({
   ...d, activityReports: [...d.activityReports, { date: "", title: "", summary: "" }]
 }));

 const updateReport = (i: number, key: keyof ActivityReport, v: string) =>
   setData(d => ({ ...d, activityReports: d.activityReports.map((r, idx) => idx === i ? { ...r, [key]: v } : r) }));

 const removeReport = (i: number) =>
   setData(d => ({ ...d, activityReports: d.activityReports.filter((_, idx) => idx !== i) }));

 const addVote = () => setData(d => ({
   ...d, billVotes: [...d.billVotes, { bill: "", category: "", vote: "賛成", date: "" }]
 }));

 const updateVote = (i: number, key: keyof BillVote, v: string) =>
   setData(d => ({ ...d, billVotes: d.billVotes.map((v2, idx) => idx === i ? { ...v2, [key]: v } : v2) }));

 const removeVote = (i: number) =>
   setData(d => ({ ...d, billVotes: d.billVotes.filter((_, idx) => idx !== i) }));

 return (
   <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 40px" }}>

     {/* 基本情報 */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 14 }}>基本情報</div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
         <Field label="都道府県"><input style={inputStyle} value={data.prefecture} onChange={e => up("prefecture", e.target.value)} placeholder="例：東京都" /></Field>
         <Field label="市区町村"><input style={inputStyle} value={data.city} onChange={e => up("city", e.target.value)} placeholder="例：中野区" /></Field>
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
         <Field label="氏名"><input style={inputStyle} value={data.name} onChange={e => up("name", e.target.value)} /></Field>
         <Field label="所属政党"><input style={inputStyle} value={data.party} onChange={e => up("party", e.target.value)} /></Field>
       </div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
         <Field label="役職"><input style={inputStyle} value={data.assembly} onChange={e => up("assembly", e.target.value)} placeholder="例：中野区長" /></Field>
         <Field label="任期"><input style={inputStyle} value={data.term} onChange={e => up("term", e.target.value)} placeholder="例：2018年 - 現在" /></Field>
       </div>
     </div>

     {/* 理念・メッセージ */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 14 }}>理念・メッセージ</div>
       <Field label="タグライン">
         <input style={inputStyle} value={data.tagline} onChange={e => up("tagline", e.target.value)} placeholder="例：区民とともに、中野の未来をつくる" />
       </Field>
       <Field label="メッセージ">
         <textarea style={{ ...textareaStyle, minHeight: 80 }} value={data.message} onChange={e => up("message", e.target.value)} />
       </Field>
     </div>

     {/* 公約 */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
         <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em" }}>公約</div>
         <button onClick={addPromise} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "#f5f4f0", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", cursor: "pointer" }}>
           <Icon type="plus" size={12} color="#555" /> 追加
         </button>
       </div>
       {data.promises.map((p, i) => (
         <div key={i} style={{ border: "1px solid #e8e8e8", borderRadius: 9, padding: "12px", marginBottom: 8 }}>
           <Field label="公約タイトル"><input style={inputStyle} value={p.title} onChange={e => updatePromise(i, "title", e.target.value)} /></Field>
           <Field label="達成状況">
             <select style={{ ...inputStyle, appearance: "none" }} value={p.status} onChange={e => updatePromise(i, "status", e.target.value)}>
               <option value="未着手">未着手</option>
               <option value="進行中">進行中</option>
               <option value="達成">達成</option>
               <option value="変更">変更</option>
             </select>
           </Field>
           <Field label="根拠・コメント"><textarea style={{ ...textareaStyle, minHeight: 60 }} value={p.evidence} onChange={e => updatePromise(i, "evidence", e.target.value)} /></Field>
           <button onClick={() => removePromise(i)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "none", border: "1px solid #f0d0d0", borderRadius: 7, color: "#c07070", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
             <Icon type="trash" size={12} color="#c07070" /> 削除
           </button>
         </div>
       ))}
     </div>

     {/* 活動記録 */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 14 }}>議会活動記録</div>
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
         <Field label="出席率(%)"><input style={inputStyle} type="number" value={data.attendanceRate} onChange={e => up("attendanceRate", Number(e.target.value))} /></Field>
         <Field label="発言回数"><input style={inputStyle} type="number" value={data.speechCount} onChange={e => up("speechCount", Number(e.target.value))} /></Field>
         <Field label="質問回数"><input style={inputStyle} type="number" value={data.questionCount} onChange={e => up("questionCount", Number(e.target.value))} /></Field>
       </div>
     </div>

     {/* 賛否記録 */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
         <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em" }}>賛否記録</div>
         <button onClick={addVote} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "#f5f4f0", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", cursor: "pointer" }}>
           <Icon type="plus" size={12} color="#555" /> 追加
         </button>
       </div>
       {data.billVotes.map((v, i) => (
         <div key={i} style={{ border: "1px solid #e8e8e8", borderRadius: 9, padding: "12px", marginBottom: 8 }}>
           <Field label="議案名"><input style={inputStyle} value={v.bill} onChange={e => updateVote(i, "bill", e.target.value)} /></Field>
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
             <Field label="カテゴリ"><input style={inputStyle} value={v.category} onChange={e => updateVote(i, "category", e.target.value)} /></Field>
             <Field label="賛否">
               <select style={{ ...inputStyle, appearance: "none" }} value={v.vote} onChange={e => updateVote(i, "vote", e.target.value)}>
                 <option value="賛成">賛成</option>
                 <option value="反対">反対</option>
                 <option value="棄権">棄権</option>
               </select>
             </Field>
             <Field label="日付"><input style={inputStyle} type="date" value={v.date} onChange={e => updateVote(i, "date", e.target.value)} /></Field>
           </div>
           <button onClick={() => removeVote(i)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "none", border: "1px solid #f0d0d0", borderRadius: 7, color: "#c07070", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
             <Icon type="trash" size={12} color="#c07070" /> 削除
           </button>
         </div>
       ))}
     </div>

     {/* 活動報告 */}
     <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
         <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em" }}>活動報告</div>
         <button onClick={addReport} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "#f5f4f0", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", cursor: "pointer" }}>
           <Icon type="plus" size={12} color="#555" /> 追加
         </button>
       </div>
       {data.activityReports.map((r, i) => (
         <div key={i} style={{ border: "1px solid #e8e8e8", borderRadius: 9, padding: "12px", marginBottom: 8 }}>
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
             <Field label="日付"><input style={inputStyle} type="date" value={r.date} onChange={e => updateReport(i, "date", e.target.value)} /></Field>
             <Field label="タイトル"><input style={inputStyle} value={r.title} onChange={e => updateReport(i, "title", e.target.value)} /></Field>
           </div>
           <Field label="内容"><textarea style={{ ...textareaStyle, minHeight: 60 }} value={r.summary} onChange={e => updateReport(i, "summary", e.target.value)} /></Field>
           <button onClick={() => removeReport(i)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "none", border: "1px solid #f0d0d0", borderRadius: 7, color: "#c07070", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
             <Icon type="trash" size={12} color="#c07070" /> 削除
           </button>
         </div>
       ))}
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
       }}>この現職議員を削除する</button>
     )}
   </div>
 );
}
