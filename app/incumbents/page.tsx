import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { Incumbent, IncumbentPromise } from "@/lib/types";

async function getIncumbents(): Promise<Incumbent[]> {
  const filePath = path.join(process.cwd(), "data", "incumbents.json");
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

function Icon({ type, size = 16, color = "#666" }: { type: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none" as const };
  const m: Record<string, ReactElement> = {
    back: <svg {...p}><path d="M12.5 5L7.5 10L12.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    speech: <svg {...p}><path d="M3 4h14v9H8l-5 4V4Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 8h6M7 11h4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    vote: <svg {...p}><rect x="3" y="3" width="14" height="14" rx="1.5" stroke={color} strokeWidth="1.4"/><path d="M6 10l2.5 2.5L14 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    promise: <svg {...p}><path d="M5 3h10v14H5V3Z" stroke={color} strokeWidth="1.4"/><path d="M8 7h4M8 10h4M8 13h2" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    report: <svg {...p}><path d="M4 4h12v12H4V4Z" stroke={color} strokeWidth="1.4"/><path d="M7 8h6M7 11h6M7 14h3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
  };
  return m[type] ?? null;
}

function Section({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
        <Icon type={icon} size={14} color="#aaa" />
        <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", letterSpacing: "0.18em" }}>
          {label}
        </div>
      </div>
      {children}
    </div>
  );
}

function PromiseStatus({ status }: { status: IncumbentPromise["status"] }) {
  const colors: Record<IncumbentPromise["status"], string> = {
    "達成": "#2f6f4e",
    "進行中": "#2D4A6B",
    "未着手": "#8a8a8a",
    "変更": "#7a5a2c",
  };

  return (
    <span style={{
      padding: "2px 7px", borderRadius: 999,
      background: `${colors[status]}14`, color: colors[status],
      fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700,
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

function IncumbentCard({ incumbent }: { incumbent: Incumbent }) {
  const totalActions = incumbent.speechCount + incumbent.questionCount;

  return (
    <article style={{
      background: "#fff", border: "1px solid #ebebeb",
      borderRadius: 12, padding: "17px 16px", marginBottom: 12,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", letterSpacing: "0.08em", marginBottom: 3 }}>
            {incumbent.prefecture} {incumbent.city} / {incumbent.assembly}
          </div>
          <div style={{ fontSize: 17, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", letterSpacing: "0.04em" }}>
            {incumbent.name}
          </div>
          <div style={{ fontSize: 10.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", marginTop: 3 }}>
            {incumbent.party || "無所属"}・{incumbent.term}
          </div>
        </div>
        <div style={{
          minWidth: 58, borderRadius: 10, background: "#f5f4f0",
          padding: "8px 9px", textAlign: "center",
        }}>
          <div style={{ fontSize: 19, fontFamily: "'Cormorant Garamond', serif", color: "#1a1a1a", lineHeight: 1 }}>
            {totalActions}
          </div>
          <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", marginTop: 3 }}>
            発言・質問
          </div>
        </div>
      </div>

      <Section icon="speech" label="議会での発言・質問回数">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { label: "発言", value: incumbent.speechCount },
            { label: "質問", value: incumbent.questionCount },
          ].map(item => (
            <div key={item.label} style={{ background: "#fafaf8", borderRadius: 9, padding: "11px 12px" }}>
              <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", marginBottom: 3 }}>
                {item.label}
