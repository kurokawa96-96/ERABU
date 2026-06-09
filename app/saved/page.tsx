"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

function Icon({ type, size = 18, color = "#1a1a1a" }: { type: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none" as const };
  const icons: Record<string, React.ReactElement> = {
    back:     <svg {...p}><path d="M12.5 5L7.5 10L12.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    bookmark: <svg {...p}><path d="M5 2h10v16l-5-4-5 4V2Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
    trash:    <svg {...p}><path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };
  return icons[type] ?? null;
}

interface SavedCandidate {
  id: string;
  name: string;
  party: string;
  electionName: string;
  electionId: string;
}

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedCandidate[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem("erabu_saved") ?? "[]");
      const details: SavedCandidate[] = JSON.parse(localStorage.getItem("erabu_saved_details") ?? "[]");
      const filtered = details.filter(d => ids.includes(d.id));
      setSaved(filtered);
    } catch {
      setSaved([]);
    }
    setLoaded(true);
  }, []);

  const remove = (id: string) => {
    const ids: string[] = JSON.parse(localStorage.getItem("erabu_saved") ?? "[]");
    const details: SavedCandidate[] = JSON.parse(localStorage.getItem("erabu_saved_details") ?? "[]");
    const nextIds = ids.filter(x => x !== id);
    const nextDetails = details.filter(x => x.id !== id);
    localStorage.setItem("erabu_saved", JSON.stringify(nextIds));
    localStorage.setItem("erabu_saved_details", JSON.stringify(nextDetails));
    setSaved(nextDetails);
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#f5f4f0" }}>
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

      <div style={{ padding: "24px 24px 18px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <Icon type="bookmark" size={24} color="#aaa" />
        </div>
        <div style={{ fontSize: 18, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", letterSpacing: "0.06em" }}>
          保存した候補者
        </div>
      </div>

      <div style={{ padding: "0 14px 40px" }}>
        {!loaded ? null : saved.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "40px 20px",
            fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif",
            color: "#bbb", lineHeight: 1.8,
          }}>
            保存した候補者はいません。
            候補者ページのブックマークアイコンから保存できます。
          </div>
        ) : (
          saved.map(c => (
            <div key={c.id} style={{
              background: "#fff", borderRadius: 12,
              border: "1px solid #ebebeb", marginBottom: 8,
              display: "flex", alignItems: "center",
              padding: "14px 16px", gap: 12,
            }}>
              <Link href={`/election/${c.electionId}`} style={{ textDecoration: "none", flex: 1 }}>
                <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", marginBottom: 2 }}>
                  {c.electionName}
                </div>
                <div style={{ fontSize: 15, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a" }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", marginTop: 2 }}>
                  {c.party || "無所属"}
                </div>
              </Link>
              <button onClick={() => remove(c.id)} style={{
                background: "none", border: "none", cursor: "pointer", padding: 6,
              }}>
                <Icon type="trash" size={15} color="#ccc" />
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: "center", padding: "0 0 32px", fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#d0d0d0", letterSpacing: "0.12em" }}>
        分かるから、選べる
      </div>
    </div>
  );
}
