"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Policy {
  icon: string;
  label: string;
  issue: string;
  solution: string;
  deadline: string;
  budget: string;
}
interface Update {
  type: string;
  label: string;
  date: string;
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
interface SNS {
  hp?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  other?: string;
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
  updates: Update[];
  notices?: Notice[];
  links?: CandidateLink[];
  sns?: SNS;
}
interface Election {
  id: string;
  prefecture: string;
  city: string;
  name: string;
  type: string;
  electionDate: string;
  status: string;
}

function Icon({ type, size = 18, color = "#1a1a1a" }: { type: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none" as const };
  const icons: Record<string, React.ReactElement> = {
    chevronDown: <svg {...p}><path d="M5 7.5L10 12.5L15 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    chevronRight: <svg {...p}><path d="M7.5 5L12.5 10L7.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    back: <svg {...p}><path d="M12.5 5L7.5 10L12.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    info: <svg {...p}><circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.4"/><path d="M10 9v5M10 6.5v.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>,
    education: <svg {...p}><rect x="2" y="9" width="16" height="9" rx="1" stroke={color} strokeWidth="1.4"/><path d="M10 2L2 7h16L10 2Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
    medical: <svg {...p}><rect x="2" y="2" width="16" height="16" rx="2" stroke={color} strokeWidth="1.4"/><path d="M10 6v8M6 10h8" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></svg>,
    environment: <svg {...p}><path d="M10 17V9" stroke={color} strokeWidth="1.4" strokeLinecap="round"/><path d="M10 9C10 9 5 9 4 4c3 0 6 1 6 5Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/><path d="M10 12C10 12 15 11 16 6c-3 0-6 2-6 6Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    industry: <svg {...p}><rect x="2" y="10" width="6" height="8" rx="0.5" stroke={color} strokeWidth="1.3"/><rect x="7" y="7" width="6" height="11" rx="0.5" stroke={color} strokeWidth="1.3"/><rect x="12" y="4" width="6" height="14" rx="0.5" stroke={color} strokeWidth="1.3"/></svg>,
    transport: <svg {...p}><rect x="3" y="5" width="14" height="9" rx="2" stroke={color} strokeWidth="1.4"/><path d="M3 10h14" stroke={color} strokeWidth="1.2"/><circle cx="6.5" cy="16" r="1.5" stroke={color} strokeWidth="1.3"/><circle cx="13.5" cy="16" r="1.5" stroke={color} strokeWidth="1.3"/></svg>,
    reform: <svg {...p}><circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.4"/><path d="M10 6v4l3 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    participation: <svg {...p}><circle cx="7" cy="6" r="2.5" stroke={color} strokeWidth="1.3"/><circle cx="13" cy="6" r="2.5" stroke={color} strokeWidth="1.3"/><path d="M2 17c0-3 2-5 5-5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/><path d="M18 17c0-3-2-5-5-5" stroke={color} strokeWidth="1.3" strokeLinecap="round"/><path d="M10 12c-2.5 0-4 2-4 5h8c0-3-1.5-5-4-5Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round"/></svg>,
    childcare: <svg {...p}><circle cx="10" cy="7" r="3" stroke={color} strokeWidth="1.4"/><path d="M4 18c0-4 2.7-6 6-6s6 2 6 6" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>,
    data: <svg {...p}><rect x="3" y="3" width="14" height="14" rx="1.5" stroke={color} strokeWidth="1.4"/><path d="M7 7h6M7 10h6M7 13h4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    energy: <svg {...p}><path d="M11 2L4 11h6l-1 7 7-9h-6l1-7Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
    digital: <svg {...p}><rect x="2" y="4" width="16" height="11" rx="1.5" stroke={color} strokeWidth="1.4"/><path d="M7 18h6M10 15v3" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>,
    economy: <svg {...p}><path d="M3 14c0-4 3-7 7-7s7 3 7 7" stroke={color} strokeWidth="1.4" strokeLinecap="round"/><path d="M10 7V4M7 5l3-1 3 1" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    finance: <svg {...p}><rect x="2" y="5" width="16" height="12" rx="1.5" stroke={color} strokeWidth="1.4"/><path d="M2 9h16" stroke={color} strokeWidth="1.3"/><circle cx="10" cy="13" r="2" stroke={color} strokeWidth="1.3"/></svg>,
    tax: <svg {...p}><path d="M4 16L16 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><circle cx="6" cy="6" r="2" stroke={color} strokeWidth="1.3"/><circle cx="14" cy="14" r="2" stroke={color} strokeWidth="1.3"/></svg>,
    welfare: <svg {...p}><path d="M10 17c-4-2.5-7-5.5-7-9a4 4 0 018 0 4 4 0 018 0c0 3.5-3 6.5-7 9Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  };
  return icons[type] ?? icons["data"];
}

// SNSアイコン（各ブランドSVG）
function SnsIcon({ type, size = 18 }: { type: string; size?: number }) {
  const s = { width: size, height: size, viewBox: "0 0 24 24" };
  const icons: Record<string, React.ReactElement> = {
    x: <svg {...s} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    instagram: <svg {...s} fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
    facebook: <svg {...s} fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    youtube: <svg {...s} fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  };
  return icons[type] ?? null;
}

const POLICY_ROWS: { key: keyof Policy; label: string }[] = [
  { key: "issue", label: "課題" },
  { key: "solution", label: "解決策" },
  { key: "deadline", label: "期限" },
  { key: "budget", label: "財源・根拠" },
];

function PolicyBlock({ policy }: { policy: Policy }) {
  const allEmpty = POLICY_ROWS.every(r => !policy[r.key]);
  return (
    <div style={{ background: "#fafaf8", borderRadius: 9, overflow: "hidden", marginBottom: 7 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px 8px", borderBottom: "1px solid #f0f0ee" }}>
        <Icon type={policy.icon} size={16} color="#555" />
        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Noto Sans JP', sans-serif", color: "#222", letterSpacing: "0.05em" }}>
          {policy.label}
        </span>
      </div>
      <div style={{ padding: "8px 12px 10px" }}>
        {allEmpty ? (
          <div style={{ fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#ccc", letterSpacing: "0.08em" }}>未記入</div>
        ) : (
          POLICY_ROWS.map(({ key, label }) => (
            <div key={key} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: "0 8px", marginBottom: 7, alignItems: "flex-start" }}>
              <span style={{ fontSize: 9.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.1em", paddingTop: 1 }}>
                {label}
              </span>
              {policy[key] ? (
                <span style={{ fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#2a2a2a", lineHeight: 1.7 }}>
                  {policy[key]}
                </span>
              ) : (
                <span style={{ fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#d0d0d0", letterSpacing: "0.08em" }}>未記入</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const UPDATE_COLORS: Record<string, string> = {
  message: "#2D4A6B",
  policy: "#3D5A48",
  schedule: "#5C3D2E",
  info: "#4A3570",
};

function UpdateBadge({ update }: { update: { type: string; label: string; date: string } }) {
  const color = UPDATE_COLORS[update.type] ?? "#888";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 5, padding: "3px 9px", background: `${color}14`, borderRadius: 20 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color, letterSpacing: "0.05em" }}>
        {update.label}　{update.date}
      </span>
    </div>
  );
}

// SNSボタン一覧
function SnsButtons({ sns }: { sns?: SNS }) {
  if (!sns) return null;
  const hasAny = Object.values(sns).some(v => v);
  if (!hasAny) return null;

  return (
    <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
      {sns.hp && (
        <a href={sns.hp} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "6px 12px", borderRadius: 20,
          border: "1px solid #1a1a1a", background: "#1a1a1a",
          fontSize: 10.5, fontFamily: "'Noto Sans JP', sans-serif",
          color: "#fff", textDecoration: "none", letterSpacing: "0.08em",
        }}>
          OFFICIAL HP
        </a>
      )}
      {sns.x && (
        <a href={sns.x} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 34, height: 34, borderRadius: "50%",
          border: "1px solid #e0e0e0", background: "#fff",
          color: "#1a1a1a", textDecoration: "none",
        }}>
          <SnsIcon type="x" size={15} />
        </a>
      )}
      {sns.instagram && (
        <a href={sns.instagram} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 34, height: 34, borderRadius: "50%",
          border: "1px solid #e0e0e0", background: "#fff",
          color: "#E1306C", textDecoration: "none",
        }}>
          <SnsIcon type="instagram" size={15} />
        </a>
      )}
      {sns.facebook && (
        <a href={sns.facebook} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 34, height: 34, borderRadius: "50%",
          border: "1px solid #e0e0e0", background: "#fff",
          color: "#1877F2", textDecoration: "none",
        }}>
          <SnsIcon type="facebook" size={15} />
        </a>
      )}
      {sns.youtube && (
        <a href={sns.youtube} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 34, height: 34, borderRadius: "50%",
          border: "1px solid #e0e0e0", background: "#fff",
          color: "#FF0000", textDecoration: "none",
        }}>
          <SnsIcon type="youtube" size={15} />
        </a>
      )}
      {sns.other && (
        <a href={sns.other} target="_blank" rel="noopener noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "6px 12px", borderRadius: 20,
          border: "1px solid #e0e0e0", background: "#fafaf8",
          fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif",
          color: "#555", textDecoration: "none",
        }}>
          その他
          <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
            <path d="M8 12l8-8M11 4h5v5" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      )}
    </div>
  );
}

function CandidateCard({ candidate, isOpen, onToggle, isSaved, onSave }: {
  candidate: Candidate;
  isOpen: boolean;
  onToggle: () => void;
  isSaved: boolean;
  onSave: () => void;
}) {
  return (
    <div style={{
      borderRadius: 12, background: "#fff",
      border: `1px solid ${isOpen ? "#d8d8d8" : "#ebebeb"}`,
      marginBottom: 8, overflow: "hidden",
      transition: "border-color 0.3s",
      position: "relative",
    }}>
      <button onClick={onToggle} style={{
        width: "100%", display: "flex", alignItems: "center",
        gap: 14, padding: "16px 16px",
        background: "none", border: "none", cursor: "pointer",
      }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f0f0f0", flexShrink: 0 }} />
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", letterSpacing: "0.1em", marginBottom: 3 }}>
            {candidate.party || "　"}
          </div>
          <div style={{ fontSize: 15, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", letterSpacing: "0.05em" }}>
            {candidate.name}
          </div>
          {candidate.updates && candidate.updates[0] && (
            <UpdateBadge update={candidate.updates[0]} />
          )}
        </div>
        <div style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease" }}>
          <Icon type="chevronDown" size={16} color={isOpen ? "#1a1a1a" : "#ccc"} />
        </div>
      </button>

      <button
        onClick={e => { e.stopPropagation(); onSave(); }}
        style={{ position: "absolute", top: 12, right: 48, background: "none", border: "none", cursor: "pointer", padding: 4 }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill={isSaved ? "#1a1a1a" : "none"}>
          <path d="M5 2h10v16l-5-4-5 4V2Z" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
      </button>

      <div style={{
        maxHeight: isOpen ? "1600px" : 0,
        overflow: "hidden",
        transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{
          padding: "0 14px 20px",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s",
        }}>
          <div style={{ height: 1, background: "#f0f0f0", marginBottom: 14 }} />

          {candidate.tagline && (
            <div style={{ borderLeft: "2px solid #1a1a1a", paddingLeft: 12, marginBottom: 18, fontSize: 13, fontFamily: "'Noto Serif JP', serif", color: "#333", lineHeight: 1.8 }}>
              {candidate.tagline}
            </div>
          )}

          {/* SNSボタン（最上部に表示） */}
          <SnsButtons sns={candidate.sns} />

          {candidate.policies.length > 0 && (
            <>
              <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 10, marginTop: candidate.sns && Object.values(candidate.sns).some(v => v) ? 14 : 0 }}>
                POLICY
              </div>
              {candidate.policies.map((p, i) => (
                <PolicyBlock key={i} policy={p} />
              ))}
            </>
          )}

          {candidate.message && (
            <div style={{ margin: "14px 0 0", padding: "11px 13px", background: "#f8f8f6", borderRadius: 8, fontSize: 12, fontFamily: "'Noto Serif JP', serif", color: "#3a3a3a", lineHeight: 1.9 }}>
              {candidate.message}
            </div>
          )}

          {candidate.notices && candidate.notices.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 10 }}>
                お知らせ
              </div>
              {candidate.notices.map((notice, i) => (
                <div key={i} style={{ padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid #f2f2f2" }}>
                  <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", marginBottom: 3 }}>{notice.date}</div>
                  <div style={{ fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#222", fontWeight: 700, marginBottom: 3 }}>{notice.title}</div>
                  <div style={{ fontSize: 11.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#777", lineHeight: 1.7 }}>{notice.content}</div>
                </div>
              ))}
            </div>
          )}

          {candidate.profile && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ fontSize: 10.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.1em", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", gap: 5 }}>
                <Icon type="chevronRight" size={11} color="#ccc" /> 経歴
              </summary>
              <div style={{ marginTop: 8, paddingLeft: 12, fontSize: 11.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#999", lineHeight: 1.7 }}>
                {candidate.profile}
              </div>
            </details>
          )}

          {candidate.links && candidate.links.length > 0 && (
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {candidate.links.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#fafaf8", fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", textDecoration: "none" }}
                >
                  {link.label || "リンク"}
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                    <path d="M8 12l8-8M11 4h5v5" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              ))}
            </div>
          )}

          {/* 編集案内 */}
          <Link href="/pricing" style={{
            display: "block", marginTop: 16, padding: "11px 14px",
            background: "#f8f8f6", border: "1px solid #e8e8e8",
            borderRadius: 9, textDecoration: "none", textAlign: "center",
          }}>
            <span style={{ fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#a09880", letterSpacing: "0.08em" }}>
              この候補者ページは編集できます →
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default function ElectionClient({ election, candidates }: {
  election: Election;
  candidates: Candidate[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [shuffled] = useState(() => [...candidates].sort(() => Math.random() - 0.5));
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("erabu_saved") ?? "[]");
    } catch { return []; }
  });

  const toggleSave = (id: string) => {
    const candidate = shuffled.find(c => c.id === id);
    const next = savedIds.includes(id)
      ? savedIds.filter(x => x !== id)
      : [...savedIds, id];
    setSavedIds(next);
    localStorage.setItem("erabu_saved", JSON.stringify(next));

    if (candidate && !savedIds.includes(id)) {
      const details = JSON.parse(localStorage.getItem("erabu_saved_details") ?? "[]");
      const newDetail = {
        id: candidate.id, name: candidate.name,
        party: candidate.party, electionName: election.name, electionId: election.id,
      };
      localStorage.setItem("erabu_saved_details", JSON.stringify([...details, newDetail]));
    } else {
      const details = JSON.parse(localStorage.getItem("erabu_saved_details") ?? "[]");
      localStorage.setItem("erabu_saved_details", JSON.stringify(details.filter((d: { id: string }) => d.id !== id)));
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#f5f4f0" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 20px", height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Icon type="back" size={20} color="#1a1a1a" />
        </Link>
        <div style={{ fontSize: 21, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.22em", color: "#1a1a1a" }}>
          ERABU
        </div>
        <div style={{ width: 20 }} />
      </div>

      <div style={{ padding: "20px 24px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", letterSpacing: "0.1em", marginBottom: 4 }}>
          {election.prefecture} {election.city}
        </div>
        <div style={{ fontSize: 16, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", letterSpacing: "0.06em" }}>
          {election.name}
        </div>
        <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", marginTop: 4, letterSpacing: "0.08em" }}>
          投票日 {election.electionDate}
        </div>
      </div>

      <div style={{ height: 1, background: "#e8e8e8", margin: "0 20px" }} />

      <div style={{ padding: "9px 20px", display: "flex", alignItems: "center", gap: 6 }}>
        <Icon type="info" size={12} color="#ccc" />
        <span style={{ fontSize: 9.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#ccc", letterSpacing: "0.08em" }}>
          表示順はランダムです
        </span>
      </div>

      <div style={{ padding: "4px 14px 40px" }}>
        {shuffled.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb" }}>
            候補者情報は準備中です
          </div>
        ) : (
          shuffled.map(c => (
            <CandidateCard
              key={c.id} candidate={c}
              isOpen={openId === c.id}
              onToggle={() => setOpenId(openId === c.id ? null : c.id)}
              isSaved={savedIds.includes(c.id)}
              onSave={() => toggleSave(c.id)}
            />
          ))
        )}
      </div>

      <div style={{ textAlign: "center", padding: "0 0 32px", fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#d0d0d0", letterSpacing: "0.12em" }}>
        分かるから、選べる
      </div>
    </div>
  );
}
