"use client";

import React, { useState } from "react";
import Link from "next/link";

function Icon({ type, size = 18, color = "#1a1a1a" }: { type: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none" as const };
  const icons: Record<string, React.ReactElement> = {
    back:     <svg {...p}><path d="M12.5 5L7.5 10L12.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    location: <svg {...p}><path d="M10 2C7.2 2 5 4.2 5 7c0 4 5 11 5 11s5-7 5-11c0-2.8-2.2-5-5-5Z" stroke={color} strokeWidth="1.4"/><circle cx="10" cy="7" r="2" stroke={color} strokeWidth="1.3"/></svg>,
    search:   <svg {...p}><circle cx="9" cy="9" r="5.5" stroke={color} strokeWidth="1.5"/><path d="M13 13l3.5 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  };
  return icons[type] ?? null;
}

export default function PollingPage() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query + " 選挙管理委員会")}`;
    window.open(url, "_blank");
  };

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
      <div style={{ padding: "28px 24px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <Icon type="location" size={28} color="#aaa" />
        </div>
        <div style={{ fontSize: 18, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", letterSpacing: "0.06em", marginBottom: 8 }}>
          投票所を探す
        </div>
        <div style={{ fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", lineHeight: 1.8 }}>
  お住まいの市区町村名を入力してください。
  選挙管理委員会で投票所をご確認いただけます。
</div>

      </div>

      {/* Search */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #ebebeb", padding: "20px 18px" }}>
          <div style={{ position: "relative", marginBottom: 12 }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="例：東京都中野区"
              style={{
                width: "100%", padding: "13px 44px 13px 16px",
                fontSize: 14, fontFamily: "'Noto Sans JP', sans-serif",
                border: "1px solid #e0e0e0", borderRadius: 10,
                background: "#fafafa", color: "#1a1a1a",
                outline: "none", boxSizing: "border-box",
              }}
            />
            <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
              <Icon type="search" size={16} color="#ccc" />
            </div>
          </div>

          <button
            onClick={handleSearch}
            style={{
              width: "100%", padding: 13,
              background: query.trim() ? "#1a1a1a" : "#e0e0e0",
              color: "#fff", border: "none", borderRadius: 10,
              fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif",
              letterSpacing: "0.08em", cursor: query.trim() ? "pointer" : "default",
              transition: "background 0.2s",
            }}
          >
            Googleマップで探す
          </button>
        </div>

        <div style={{
          marginTop: 12, padding: "10px 14px",
          fontSize: 10.5, fontFamily: "'Noto Sans JP', sans-serif",
          color: "#bbb", lineHeight: 1.8, textAlign: "center",
        }}>
          投票所は選挙ごとに変わる場合があります。
          お住まいの自治体の公式情報もあわせてご確認ください。
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "32px 0", fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#d0d0d0", letterSpacing: "0.12em" }}>
        分かるから、選べる
      </div>
    </div>
  );
}
