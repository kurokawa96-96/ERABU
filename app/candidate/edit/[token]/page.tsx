"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Policy {
  icon: string;
  label: string;
  issue: string;
  solution: string;
  deadline: string;
  budget: string;
}

interface Notice {
  date: string;
  title: string;
  content: string;
}

interface CandidateLink {
  label: string;
  url: string;
}

interface Update {
  type: string;
  label: string;
  date: string;
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
  notices: Notice[];
  links: CandidateLink[];
  updates: Update[];
  editToken?: string;
}

const POLICY_ICONS = [
  "education","medical","environment","industry",
  "transport","reform","participation","childcare",
  "data","energy","digital"
];

const UPDATE_TYPES: Record<string, { label: string; color: string }> = {
  message:  { label: "メッセージを更新しました", color: "#2D4A6B" },
  policy:   { label: "政策・理念を更新しました", color: "#3D5A48" },
  schedule: { label: "活動スケジュールを追加しました", color: "#5C3D2E" },
  info:     { label: "候補者情報を更新しました", color: "#4A3570" },
};

function Icon({ type, size = 16, color = "#666" }: { type: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none" as const };
  const m: Record<string, React.ReactElement> = {
    back:    <svg {...p}><path d="M12.5 5L7.5 10L12.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    plus:    <svg {...p}><path d="M10 4v12M4 10h12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    trash:   <svg {...p}><path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    save:    <svg {...p}><rect x="3" y="3" width="14" height="14" rx="1.5" stroke={color} strokeWidth="1.4"/><path d="M7 3v5h6V3M7 13h6" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    chevron: <svg {...p}><path d="M5 7.5L10 12.5L15 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
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
  useEffect(() => {
    if (msg) { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }
  }, [msg, onDone]);
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
function Section({ title, children, onSave }: {
  title: string;
  children: React.ReactNode;
  onSave: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", marginBottom: 12, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "16px 18px",
        background: "none", border: "none", cursor: "pointer",
      }}>
        <span style={{ fontSize: 14, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", letterSpacing: "0.04em" }}>
          {title}
        </span>
        <div style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
          <Icon type="chevron" size={16} color="#aaa" />
        </div>
      </button>

      <div style={{
        maxHeight: open ? "2000px" : 0,
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ padding: "0 18px 18px" }}>
          <div style={{ height: 1, background: "#f0f0f0", marginBottom: 16 }} />
          {children}
          <button onClick={onSave} style={{
            width: "100%", padding: 12, background: "#1a1a1a",
            color: "#fff", border: "none", borderRadius: 9,
            fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            cursor: "pointer", marginTop: 8,
          }}>
            <Icon type="save" size={14} color="#fff" /> 保存する
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CandidateEditPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState("");
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    params.then(p => {
      setToken(p.token);
      fetch(`/api/candidate/${p.token}`)
        .then(r => {
          if (!r.ok) { setNotFound(true); setLoading(false); return; }
          return r.json();
        })
        .then(d => {
          if (d) { setCandidate(d.candidate); }
          setLoading(false);
        })
        .catch(() => { setNotFound(true); setLoading(false); });
    });
  }, [params]);

  const saveSection = async (updates: Partial<Candidate>, updateType: string) => {
    if (!candidate) return;
    const today = new Date().toISOString().slice(0, 10);
    const newUpdate: Update = {
      type: updateType,
      label: UPDATE_TYPES[updateType]?.label ?? "情報を更新しました",
      date: today,
    };
    const updatedUpdates = [newUpdate, ...(candidate.updates ?? []).slice(0, 9)];
    const payload = { ...updates, updates: updatedUpdates };

    const res = await fetch(`/api/candidate/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setCandidate(prev => prev ? { ...prev, ...payload } : prev);
      setToast("保存しました");
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f5f4f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb" }}>読み込み中...</div>
    </div>
  );

  if (notFound || !candidate) return (
    <div style={{ minHeight: "100vh", background: "#f5f4f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <div style={{ fontSize: 14, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a" }}>ページが見つかりません</div>
      <div style={{ fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa" }}>URLをご確認ください</div>
      <Link href="/" style={{ textDecoration: "none", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#2D4A6B" }}>
        トップに戻る
      </Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#f5f4f0" }}>
      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8e8e8",
        padding: "0 20px", height: 54,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 20,
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Icon type="back" size={20} color="#1a1a1a" />
        </Link>
        <div style={{ fontSize: 21, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.22em", color: "#1a1a1a" }}>
          ERABU
        </div>
        <div style={{ width: 20 }} />
      </div>

      {/* Title */}
      <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", letterSpacing: "0.1em", marginBottom: 4 }}>
          候補者ページ編集
        </div>
        <div style={{ fontSize: 18, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", letterSpacing: "0.06em" }}>
          {candidate.name || "氏名未設定"}
        </div>
      </div>

      <div style={{ padding: "0 14px 40px" }}>

        {/* ① 基本情報 */}
        <Section title="基本情報" onSave={() => saveSection({
          name: candidate.name,
          party: candidate.party,
          tagline: candidate.tagline,
          profile: candidate.profile,
        }, "info")}>
          <Field label="氏名">
            <input style={inputStyle} value={candidate.name} onChange={e => setCandidate(p => p ? { ...p, name: e.target.value } : p)} />
          </Field>
          <Field label="所属政党">
            <input style={inputStyle} value={candidate.party} onChange={e => setCandidate(p => p ? { ...p, party: e.target.value } : p)} />
          </Field>
          <Field label="タグライン">
            <input style={inputStyle} value={candidate.tagline} onChange={e => setCandidate(p => p ? { ...p, tagline: e.target.value } : p)} placeholder="例：地域の未来を、みんなで変える" />
          </Field>
          <Field label="経歴">
            <textarea style={{ ...textareaStyle, minHeight: 72 }} value={candidate.profile} onChange={e => setCandidate(p => p ? { ...p, profile: e.target.value } : p)} />
          </Field>
        </Section>

        {/* ② 政策・理念・思想 */}
        <Section title="政策・理念・思想" onSave={() => saveSection({
          message: candidate.message,
          policies: candidate.policies,
        }, "policy")}>
          <Field label="メッセージ">
            <textarea style={{ ...textareaStyle, minHeight: 100 }} value={candidate.message} onChange={e => setCandidate(p => p ? { ...p, message: e.target.value } : p)} placeholder="有権者へのメッセージ" />
          </Field>
          <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 10, marginTop: 8 }}>
            政策
          </div>
          {candidate.policies.map((policy, i) => (
            <div key={i} style={{ border: "1px solid #e8e8e8", borderRadius: 9, padding: "12px", marginBottom: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <Field label="政策名">
                  <input style={inputStyle} value={policy.label} onChange={e => {
                    const next = [...candidate.policies];
                    next[i] = { ...next[i], label: e.target.value };
                    setCandidate(p => p ? { ...p, policies: next } : p);
                  }} />
                </Field>
                <Field label="アイコン">
                  <select style={{ ...inputStyle, appearance: "none" }} value={policy.icon} onChange={e => {
                    const next = [...candidate.policies];
                    next[i] = { ...next[i], icon: e.target.value };
                    setCandidate(p => p ? { ...p, policies: next } : p);
                  }}>
                    {POLICY_ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </Field>
              </div>
              {(["issue", "solution", "deadline", "budget"] as const).map(key => (
                <Field key={key} label={key === "issue" ? "課題" : key === "solution" ? "解決策" : key === "deadline" ? "期限" : "財源・根拠"}>
                  <textarea style={{ ...textareaStyle, minHeight: key === "issue" || key === "solution" ? 60 : 44 }}
                    value={policy[key]}
                    onChange={e => {
                      const next = [...candidate.policies];
                      next[i] = { ...next[i], [key]: e.target.value };
                      setCandidate(p => p ? { ...p, policies: next } : p);
                    }}
                  />
                </Field>
              ))}
              <button onClick={() => {
                const next = candidate.policies.filter((_, idx) => idx !== i);
                setCandidate(p => p ? { ...p, policies: next } : p);
              }} style={{
                display: "flex", alignItems: "center", gap: 4, padding: "5px 10px",
                background: "none", border: "1px solid #f0d0d0", borderRadius: 7,
                color: "#c07070", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer",
              }}>
                <Icon type="trash" size={12} color="#c07070" /> 削除
              </button>
            </div>
          ))}
          <button onClick={() => setCandidate(p => p ? { ...p, policies: [...p.policies, { icon: "education", label: "", issue: "", solution: "", deadline: "", budget: "" }] } : p)}
            style={{
              display: "flex", alignItems: "center", gap: 4, padding: "7px 12px",
              background: "#f5f4f0", border: "1px solid #e0e0e0", borderRadius: 7,
              fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", cursor: "pointer",
            }}>
            <Icon type="plus" size={12} color="#555" /> 政策を追加
          </button>
        </Section>

        {/* ③ お知らせ */}
        <Section title="お知らせ・スケジュール" onSave={() => saveSection({ notices: candidate.notices }, "schedule")}>
          {candidate.notices.map((notice, i) => (
            <div key={i} style={{ border: "1px solid #e8e8e8", borderRadius: 9, padding: "12px", marginBottom: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Field label="日付">
                  <input style={inputStyle} type="date" value={notice.date} onChange={e => {
                    const next = [...candidate.notices];
                    next[i] = { ...next[i], date: e.target.value };
                    setCandidate(p => p ? { ...p, notices: next } : p);
                  }} />
                </Field>
                <Field label="タイトル">
                  <input style={inputStyle} value={notice.title} onChange={e => {
                    const next = [...candidate.notices];
                    next[i] = { ...next[i], title: e.target.value };
                    setCandidate(p => p ? { ...p, notices: next } : p);
                  }} />
                </Field>
              </div>
              <Field label="内容">
                <textarea style={{ ...textareaStyle, minHeight: 60 }} value={notice.content} onChange={e => {
                  const next = [...candidate.notices];
                  next[i] = { ...next[i], content: e.target.value };
                  setCandidate(p => p ? { ...p, notices: next } : p);
                }} />
              </Field>
              <button onClick={() => setCandidate(p => p ? { ...p, notices: p.notices.filter((_, idx) => idx !== i) } : p)}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "none", border: "1px solid #f0d0d0", borderRadius: 7, color: "#c07070", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
                <Icon type="trash" size={12} color="#c07070" /> 削除
              </button>
            </div>
          ))}
          <button onClick={() => setCandidate(p => p ? { ...p, notices: [...p.notices, { date: "", title: "", content: "" }] } : p)}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", background: "#f5f4f0", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", cursor: "pointer" }}>
            <Icon type="plus" size={12} color="#555" /> 追加
          </button>
        </Section>

        {/* ④ リンク */}
        <Section title="リンク" onSave={() => saveSection({ links: candidate.links }, "info")}>
          <div style={{ fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", marginBottom: 12, lineHeight: 1.7 }}>
            公式サイト・選挙公報など公式情報へのリンクを追加できます
          </div>
          {candidate.links.map((link, i) => (
            <div key={i} style={{ border: "1px solid #e8e8e8", borderRadius: 9, padding: "12px", marginBottom: 8 }}>
              <Field label="ラベル">
                <input style={inputStyle} value={link.label} placeholder="例：公式サイト" onChange={e => {
                  const next = [...candidate.links];
                  next[i] = { ...next[i], label: e.target.value };
                  setCandidate(p => p ? { ...p, links: next } : p);
                }} />
              </Field>
              <Field label="URL">
                <input style={inputStyle} value={link.url} placeholder="https://" onChange={e => {
                  const next = [...candidate.links];
                  next[i] = { ...next[i], url: e.target.value };
                  setCandidate(p => p ? { ...p, links: next } : p);
                }} />
              </Field>
              <button onClick={() => setCandidate(p => p ? { ...p, links: p.links.filter((_, idx) => idx !== i) } : p)}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", background: "none", border: "1px solid #f0d0d0", borderRadius: 7, color: "#c07070", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
                <Icon type="trash" size={12} color="#c07070" /> 削除
              </button>
            </div>
          ))}
          <button onClick={() => setCandidate(p => p ? { ...p, links: [...p.links, { label: "", url: "" }] } : p)}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", background: "#f5f4f0", border: "1px solid #e0e0e0", borderRadius: 7, fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", cursor: "pointer" }}>
            <Icon type="plus" size={12} color="#555" /> リンクを追加
          </button>
        </Section>

      </div>

      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}
