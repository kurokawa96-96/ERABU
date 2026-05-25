"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Election, RegionGroup } from "@/lib/types";
import { groupElectionsByRegion, sortByElectionDate, formatDate } from "@/lib/regions";

function Icon({ type, size = 18, color = "#1a1a1a" }: { type: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none" as const };
  const icons: Record<string, JSX.Element> = {
    chevronDown: <svg {...p}><path d="M5 7.5L10 12.5L15 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    chevronRight: <svg {...p}><path d="M7.5 5L12.5 10L7.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    search: <svg {...p}><circle cx="9" cy="9" r="5.5" stroke={color} strokeWidth="1.5"/><path d="M13 13l3.5 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    calendar: <svg {...p}><rect x="2" y="4" width="16" height="14" rx="1.5" stroke={color} strokeWidth="1.4"/><path d="M2 9h16" stroke={color} strokeWidth="1.3"/><path d="M6 2v3M14 2v3" stroke={color} strokeWidth="1.4" strokeLinecap="round"/><rect x="5" y="12" width="3" height="3" rx="0.5" fill={color}/><rect x="11" y="12" width="3" height="3" rx="0.5" fill={color}/></svg>,
    menu: <svg {...p}><path d="M3 5h14M3 10h14M3 15h14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    close: <svg {...p}><path d="M4 4l12 12M16 4L4 16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    person: <svg {...p}><circle cx="10" cy="6" r="3.5" stroke={color} strokeWidth="1.4"/><path d="M3 18c0-4 3-6.5 7-6.5s7 2.5 7 6.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>,
    bookmark: <svg {...p}><path d="M5 2h10v16l-5-4-5 4V2Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
    location: <svg {...p}><path d="M10 2C7.2 2 5 4.2 5 7c0 4 5 11 5 11s5-7 5-11c0-2.8-2.2-5-5-5Z" stroke={color} strokeWidth="1.4"/><circle cx="10" cy="7" r="2" stroke={color} strokeWidth="1.3"/></svg>,
    info: <svg {...p}><circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.4"/><path d="M10 9v5M10 6.5v.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>,
  };
  return icons[type] ?? null;
}

function ElectionRow({ election }: { election: Election }) {
  return (
    <Link href={`/election/${election.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 28px", borderTop: "1px solid #f0f0f0", cursor: "pointer",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#f5f4f0")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <div>
          <div style={{ fontSize: 13, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", marginBottom: 2 }}>
            {election.name}
          </div>
          <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.08em" }}>
            投票日 {formatDate(election.electionDate)}
          </div>
        </div>
        <Icon type="chevronRight" size={14} color="#ccc" />
      </div>
    </Link>
  );
}

function RegionAccordion({ groups }: { groups: RegionGroup[] }) {
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const [openPref, setOpenPref] = useState<string | null>(null);

  const toggleRegion = (region: string) => {
    setOpenRegion(prev => prev === region ? null : region);
    setOpenPref(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {groups.map(group => (
        <div key={group.region}>
          <button
            onClick={() => toggleRegion(group.region)}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "14px 16px",
              background: openRegion === group.region ? "#fafaf8" : "#fff",
              border: "1px solid #ebebeb",
              borderRadius: openRegion === group.region ? "10px 10px 0 0" : 10,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 14, fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a" }}>
              {group.region}
            </span>
            <div style={{ transform: openRegion === group.region ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
              <Icon type="chevronDown" size={16} color="#aaa" />
            </div>
          </button>

          <div style={{
            maxHeight: openRegion === group.region ? "800px" : 0,
            overflow: "hidden",
            transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
            border: openRegion === group.region ? "1px solid #ebebeb" : "none",
            borderTop: "none", borderRadius: "0 0 10px 10px",
          }}>
            {group.prefectures.map((prefGroup, pi) => (
              <div key={prefGroup.prefecture}>
                {pi > 0 && <div style={{ height: 1, background: "#f4f4f4", margin: "0 12px" }} />}
                <button
                  onClick={() => setOpenPref(prev => prev === prefGroup.prefecture ? null : prefGroup.prefecture)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "space-between", padding: "13px 20px",
                    background: openPref === prefGroup.prefecture ? "#f7f7f5" : "transparent",
                    border: "none", cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif", color: "#333" }}>
                    {prefGroup.prefecture}
                  </span>
                  <div style={{ transform: openPref === prefGroup.prefecture ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.25s" }}>
                    <Icon type="chevronRight" size={14} color="#bbb" />
                  </div>
                </button>

                <div style={{
                  maxHeight: openPref === prefGroup.prefecture ? "600px" : 0,
                  overflow: "hidden",
                  transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
                  background: "#fafaf8",
                }}>
                  {prefGroup.cities.map((cityGroup, ci) => (
                    <div key={cityGroup.city}>
                      <div style={{
                        padding: "11px 28px 6px",
                        borderTop: ci > 0 ? "1px solid #f0f0f0" : "none",
                        fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif",
                        color: "#aaa", letterSpacing: "0.08em",
                      }}>
                        {cityGroup.city}
                      </div>
                      {cityGroup.elections.map(election => (
                        <ElectionRow key={election.id} election={election} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
function CalendarSection({ elections }: { elections: Election[] }) {
  const [open, setOpen] = useState(false);
  const sorted = useMemo(() => sortByElectionDate(elections), [elections]);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "14px 16px",
          background: "#fff", border: "1px solid #ebebeb",
          borderRadius: open ? "10px 10px 0 0" : 10, cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon type="calendar" size={16} color="#888" />
          <span style={{ fontSize: 14, fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a" }}>直近の選挙</span>
        </div>
        <div style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
          <Icon type="chevronDown" size={16} color="#aaa" />
        </div>
      </button>

      <div style={{
        maxHeight: open ? "600px" : 0, overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        border: open ? "1px solid #ebebeb" : "none",
        borderTop: "none", borderRadius: "0 0 10px 10px", background: "#fff",
      }}>
        {sorted.map((el, i) => (
          <div key={el.id} style={{ borderTop: i > 0 ? "1px solid #f4f4f4" : "none" }}>
            <ElectionRow election={el} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchSection({ elections }: { elections: Election[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return elections.filter(e =>
      e.prefecture.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q) ||
      e.name.toLowerCase().includes(q)
    );
  }, [query, elections]);

  return (
    <div>
      <div style={{ position: "relative" }}>
        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="都道府県・市区町村名で検索"
          style={{
            width: "100%", padding: "13px 44px 13px 16px",
            fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif",
            border: "1px solid #e0e0e0", borderRadius: 10,
            background: "#fff", color: "#1a1a1a", outline: "none", boxSizing: "border-box",
          }}
        />
        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
          <Icon type="search" size={16} color="#ccc" />
        </div>
      </div>
      {results.length > 0 && (
        <div style={{ marginTop: 4, background: "#fff", border: "1px solid #ebebeb", borderRadius: 10, overflow: "hidden" }}>
          {results.map((el, i) => (
            <div key={el.id} style={{ borderTop: i > 0 ? "1px solid #f4f4f4" : "none" }}>
              <ElectionRow election={el} />
            </div>
          ))}
        </div>
      )}
      {query.trim() && results.length === 0 && (
        <div style={{ marginTop: 4, padding: "16px", textAlign: "center", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb" }}>
          該当する選挙が見つかりませんでした
        </div>
      )}
    </div>
  );
}

function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = [
    { icon: "person", label: "現職議員を見る", href: "/incumbents" },
    { icon: "calendar", label: "選挙カレンダー", href: "/calendar" },
    { icon: "location", label: "投票所を探す", href: "/polling" },
    { icon: "bookmark", label: "保存した候補者", href: "/saved" },
    { icon: "info", label: "ERABUについて", href: "/about" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, pointerEvents: open ? "all" : "none" }}>
      <div onClick={onClose} style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.18)",
        opacity: open ? 1 : 0, transition: "opacity 0.3s ease",
      }} />
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: "72%", maxWidth: 280, background: "#fff",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "18px 22px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em", color: "#1a1a1a" }}>MENU</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <Icon type="close" size={17} color="#999" />
          </button>
        </div>
        <div style={{ height: 1, background: "#f0f0f0", margin: "0 22px 6px" }} />
        {items.map(item => (
          <Link key={item.href} href={item.href} onClick={onClose} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "15px 22px", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#fafaf8")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <Icon type={item.icon} size={17} color="#999" />
              <span style={{ fontSize: 13.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#2a2a2a" }}>{item.label}</span>
            </div>
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "18px 22px", fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#ccc", letterSpacing: "0.12em" }}>
          分かるから、選べる
        </div>
      </div>
    </div>
  );
}

export default function HomeClient({ elections }: { elections: Election[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const regionGroups = useMemo(() => groupElectionsByRegion(elections), [elections]);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "#f5f4f0" }}>
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8e8e8",
        padding: "0 20px", height: 54,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 20,
      }}>
        <div style={{ width: 24 }} />
        <div style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.22em", color: "#1a1a1a" }}>ERABU</div>
        <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Icon type="menu" size={20} color="#1a1a1a" />
        </button>
      </div>

      <div style={{ padding: "28px 24px 22px", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontFamily: "'Noto Serif JP', serif", color: "#aaa", letterSpacing: "0.1em" }}>分かるから、選べる</div>
      </div>

      <div style={{ padding: "0 16px 20px" }}>
        <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 10 }}>検索</div>
        <SearchSection elections={elections} />
      </div>

      <div style={{ height: 1, background: "#e0e0e0", margin: "0 16px" }} />
      <div style={{ height: 20 }} />

      <div style={{ padding: "0 16px 20px" }}>
        <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 10 }}>地域から探す</div>
        <RegionAccordion groups={regionGroups} />
      </div>

      <div style={{ height: 1, background: "#e0e0e0", margin: "0 16px" }} />
      <div style={{ height: 20 }} />

      <div style={{ padding: "0 16px 32px" }}>
        <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.18em", marginBottom: 10 }}>日程から探す</div>
        <CalendarSection elections={elections} />
      </div>

      <div style={{ textAlign: "center", padding: "0 0 32px", fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#d0d0d0", letterSpacing: "0.12em" }}>
        分かるから、選べる
      </div>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
