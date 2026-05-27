"use client";

import React, { useState, useEffect, useCallback } from "react";

const POLICY_ICONS = [
  "education", "medical", "environment", "industry",
  "transport", "reform", "participation", "childcare",
  "data", "energy", "digital"
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
    back: <svg {...p}><path d="M12.5 5L7.5 10L12.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    plus: <svg {...p}><path d="M10 4v12M4 10h12" stroke={color} strokeWidth="1.5" strokeLinecap="round" /></svg>,
    trash: <svg {...p}><path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    save: <svg {...p}><rect x="3" y="3" width="14" height="14" rx="1.5" stroke={color} strokeWidth="1.4" /><path d="M7 3v5h6V3M7 13h6" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></svg>,
    chevron: <svg {...p}><path d="M5 7.5L10 12.5L15 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    lock: <svg {...p}><rect x="4" y="9" width="12" height="9" rx="1.5" stroke={color} strokeWidth="1.4" /><path d="M7 9V6a3 3 0 016 0v3" stroke={color} strokeWidth="1.4" strokeLinecap="round" /></svg>,
    logout: <svg {...p}><path d="M13 10H4M7 7l-3 3 3 3M11 6V4h5v12h-5v-2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    edit: <svg {...p}><path d="M14 3l3 3-9 9H5v-3L14 3Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" /></svg>,
  };
  return m[type] ?? null;
}

const F = {
  label: { fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", letterSpacing: "0.15em", display: "block", marginBottom: 5 } as React.CSSProperties,
  input: { width: "100%", padding: "9px 11px", fontSize: 12.5, fontFamily: "'Noto Sans JP', sans-serif", border: "1px solid #e0e0e0", borderRadius: 7, background: "#fafafa", color: "#1a1a1a", outline: "none" } as React.CSSProperties,
  textarea: { width: "100%", padding: "9px 11px", fontSize: 12.5, fontFamily: "'Noto Serif JP', serif", border: "1px solid #e0e0e0", borderRadius: 7, background: "#fafafa", color: "#1a1a1a", outline: "none", fontFamily: "'Noto Sans JP', sans-serif" } as React.CSSProperties,
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
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/elections", {
        headers: { "x-admin-password": pw },
      });
      if (res.ok) { 
        onLogin(pw); 
      } else { 
        setErr(true); 
        setTimeout(() => setErr(false), 1500); 
      }
    } catch {
      setErr(true);
      setTimeout(() => setErr(false), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 320 }}>
        <h1 style={{ fontSize: 24, fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 24, textAlign: "center" }}>管理者ログイン</h1>
        <Field label="パスワード">
          <input style={F.input} type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="パスワードを入力" onKeyDown={e => e.key === "Enter" && !loading && attempt()} disabled={loading} />
        </Field>
        {err && <div style={{ color: "#d32f2f", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 12, textAlign: "center" }}>パスワードが正しくありません</div>}
        <button onClick={attempt} disabled={loading} style={{ width: "100%", padding: 12, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "ログイン中..." : "ログイン"}
        </button>
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
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

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
        <button onClick={handleSave} disabled={saving} style={{
          flex: 1, padding: 12, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1
        }}>
          <Icon type="save" size={14} color="#fff" /> {saving ? "保存中..." : "保存"}
        </button>
        <button onClick={onCancel} disabled={saving} style={{
          flex: 1, padding: 12, background: "#f0f0f0", color: "#333", border: "none", borderRadius: 7, fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1
        }}>
          キャンセル
        </button>
        {onDelete && (
          <button onClick={onDelete} disabled={saving} style={{
            padding: 12, background: "#ffebee", color: "#d32f2f", border: "none", borderRadius: 7, fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", cursor: saving ? "not-allowed" : "pointer"
          }}>
            <Icon type="trash" size={14} color="#d32f2f" />
          </button>
        )}
      </div>
    </div>
  );
}

function CandidateForm({ candidate, onSave, onCancel }: {
  candidate: Candidate;
  onSave: (c: Candidate) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState({ ...candidate });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  const up = (k: keyof Candidate, v: string | Policy[]) => setData(d => ({ ...d, [k]: v }));

  const addPolicy = () => {
    const newPolicies = [...data.policies, { icon: "education", label: "", issue: "", solution: "", deadline: "", budget: "" }];
    up("policies", newPolicies);
  };

  const removePolicy = (idx: number) => {
    const newPolicies = data.policies.filter((_, i) => i !== idx);
    up("policies", newPolicies);
  };

  const updatePolicy = (idx: number, key: keyof Policy, val: string) => {
    const newPolicies = [...data.policies];
    newPolicies[idx] = { ...newPolicies[idx], [key]: val };
    up("policies", newPolicies);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 40px" }}>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 14 }}>候補者情報</div>
        <Field label="名前"><input style={F.input} value={data.name} onChange={e => up("name", e.target.value)} placeholder="山田太郎" /></Field>
        <Field label="党派"><input style={F.input} value={data.party} onChange={e => up("party", e.target.value)} placeholder="例：自由民主党" /></Field>
        <Field label="キャッチフレーズ"><input style={F.input} value={data.tagline} onChange={e => up("tagline", e.target.value)} placeholder="変革と挑戦" /></Field>
        <Field label="メッセージ"><textarea style={F.textarea} value={data.message} onChange={e => up("message", e.target.value)} placeholder="メッセージを入力" /></Field>
        <Field label="プロフィール"><textarea style={F.textarea} value={data.profile} onChange={e => up("profile", e.target.value)} placeholder="プロフィールを入力" /></Field>
      </div>

      {/* Policies Section */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "18px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 14 }}>政策</div>
        {data.policies.map((p, idx) => (
          <div key={idx} style={{ marginBottom: 16, padding: 10, background: "#f9f9f9", borderRadius: 7 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="アイコン">
                <select style={F.input} value={p.icon} onChange={e => updatePolicy(idx, "icon", e.target.value)}>
                  {POLICY_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </Field>
              <Field label="ラベル"><input style={F.input} value={p.label} onChange={e => updatePolicy(idx, "label", e.target.value)} placeholder="政策タイトル" /></Field>
            </div>
            <Field label="課題"><textarea style={F.textarea} value={p.issue} onChange={e => updatePolicy(idx, "issue", e.target.value)} placeholder="課題説明" /></Field>
            <Field label="解決策"><textarea style={F.textarea} value={p.solution} onChange={e => updatePolicy(idx, "solution", e.target.value)} placeholder="解決策" /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="期限"><input style={F.input} value={p.deadline} onChange={e => updatePolicy(idx, "deadline", e.target.value)} placeholder="2025年" /></Field>
              <Field label="予算"><input style={F.input} value={p.budget} onChange={e => updatePolicy(idx, "budget", e.target.value)} placeholder="予算額" /></Field>
            </div>
            <button onClick={() => removePolicy(idx)} style={{ padding: 8, background: "#ffebee", color: "#d32f2f", border: "none", borderRadius: 7, fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
              <Icon type="trash" size={12} color="#d32f2f" /> 削除
            </button>
          </div>
        ))}
        <button onClick={addPolicy} style={{ width: "100%", padding: 10, background: "#f0f0f0", border: "none", borderRadius: 7, fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
          <Icon type="plus" size={14} color="#666" /> 政策を追加
        </button>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleSave} disabled={saving} style={{
          flex: 1, padding: 12, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1
        }}>
          <Icon type="save" size={14} color="#fff" /> {saving ? "保存中..." : "保存"}
        </button>
        <button onClick={onCancel} disabled={saving} style={{
          flex: 1, padding: 12, background: "#f0f0f0", color: "#333", border: "none", borderRadius: 7, fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1
        }}>
          キャンセル
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [pw, setPw] = useState("");
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [toast, setToast] = useState("");
  const [editElection, setEditElection] = useState<Election | null>(null);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [selectedElectionId, setSelectedElectionId] = useState<string | null>(null);

  const show = (msg: string) => { setToast(msg); };

  const fetchElections = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/elections", { headers: { "x-admin-password": pw } });
      if (res.ok) { setElections(await res.json()); }
    } catch (error) {
      console.error("Failed to fetch elections:", error);
      show("選挙情報の取得に失敗しました");
    }
  }, [pw]);

  const fetchCandidates = useCallback(async (electionId?: string) => {
    try {
      const url = electionId ? `/api/admin/candidates?electionId=${electionId}` : "/api/admin/candidates";
      const res = await fetch(url, { headers: { "x-admin-password": pw } });
      if (res.ok) { setCandidates(await res.json()); }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      show("候補者情報の取得に失敗しました");
    }
  }, [pw]);

  useEffect(() => {
    if (pw) { 
      fetchElections(); 
    }
  }, [pw, fetchElections]);

  const handleSelectElection = useCallback((election: Election) => {
    setEditElection(election);
    setSelectedElectionId(election.id);
    setEditCandidate(null);
    fetchCandidates(election.id);
  }, [fetchCandidates]);

  const handleCreateElection = useCallback(() => {
    const newElection: Election = { 
      id: "", 
      prefecture: "", 
      city: "", 
      name: "", 
      type: "", 
      announcementDate: "", 
      electionDate: "", 
      status: "upcoming" 
    };
    setEditElection(newElection);
    setEditCandidate(null);
    setSelectedElectionId(null);
  }, []);

  if (!pw) {
    return <LoginScreen onLogin={setPw} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4f0", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #ebebeb", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 18, fontFamily: "'Noto Sans JP', sans-serif", margin: 0 }}>管理者パネル</h1>
        <button onClick={() => { setPw(""); setEditElection(null); setEditCandidate(null); setSelectedElectionId(null); }} style={{ padding: "8px 16px", background: "#f0f0f0", border: "none", borderRadius: 7, fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer" }}>
          <Icon type="logout" size={14} color="#666" /> ログアウト
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", gap: 0 }}>
        <div style={{ width: 280, background: "#fff", borderRight: "1px solid #ebebeb", overflowY: "auto" }}>
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button onClick={handleCreateElection} style={{ flex: 1, padding: 9, background: "#1a1a1a", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Icon type="plus" size={14} color="#fff" /> 選挙
              </button>
            </div>
            {elections.map((e) => (
              <div key={e.id} onClick={() => handleSelectElection(e)} style={{ padding: 10, background: selectedElectionId === e.id ? "#e8e8e8" : "#f9f9f9", borderRadius: 7, marginBottom: 8, cursor: "pointer", fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif" }}>
                {e.name}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {editElection ? (
            <ElectionForm 
              election={editElection} 
              onSave={async (e) => {
                const res = await fetch("/api/admin/elections", { 
                  method: "POST", 
                  headers: { "x-admin-password": pw, "Content-Type": "application/json" }, 
                  body: JSON.stringify(e) 
                });
                if (res.ok) { 
                  show("選挙情報を保存しました"); 
                  await fetchElections(); 
                  setEditElection(null);
                  setEditCandidate(null);
                }
                else { show("保存に失敗しました"); }
              }} 
              onCancel={() => { setEditElection(null); setEditCandidate(null); }} 
              onDelete={editElection.id ? async () => {
                const res = await fetch(`/api/admin/elections/${editElection.id}`, { 
                  method: "DELETE", 
                  headers: { "x-admin-password": pw } 
                });
                if (res.ok) { 
                  show("選挙を削除しました"); 
                  await fetchElections(); 
                  setEditElection(null);
                  setEditCandidate(null);
                  setSelectedElectionId(null);
                }
                else { show("削除に失敗しました"); }
              } : undefined} 
            />
          ) : editCandidate ? (
            <CandidateForm 
              candidate={editCandidate} 
              onSave={async (c) => {
                const res = await fetch("/api/admin/candidates", { 
                  method: "POST", 
                  headers: { "x-admin-password": pw, "Content-Type": "application/json" }, 
                  body: JSON.stringify(c) 
                });
                if (res.ok) { 
                  show("候補者情報を保存しました"); 
                  await fetchCandidates(selectedElectionId || undefined); 
                  setEditCandidate(null);
                }
                else { show("保存に失敗しました"); }
              }} 
              onCancel={() => setEditCandidate(null)} 
            />
          ) : (
            <div style={{ flex: 1, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontFamily: "'Noto Sans JP', sans-serif" }}>
              選挙または候補者を選択してください
            </div>
          )}
        </div>
      </div>

      <Toast msg={toast} onDone={() => setToast("")} />
    </div>
  );
}
