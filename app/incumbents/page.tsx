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
                </div>
              <div style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', serif", color: "#1a1a1a" }}>
                {item.value}
                <span style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", marginLeft: 3 }}>回</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="vote" label="重要議案への賛否記録">
        {incumbent.billVotes.map((vote, i) => (
          <div key={`${vote.bill}-${i}`} style={{
            padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid #f2f2f2",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#222", lineHeight: 1.55 }}>
                {vote.bill}
              </div>
              <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", marginTop: 2 }}>
                {vote.category} / {vote.date}
              </div>
            </div>
            <div style={{
              minWidth: 42, textAlign: "center", borderRadius: 999,
              padding: "4px 8px", background: vote.vote === "反対" ? "#f8eeee" : "#eef5f1",
              color: vote.vote === "反対" ? "#9a5555" : "#2f6f4e",
              fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700,
            }}>
              {vote.vote}
            </div>
          </div>
        ))}
      </Section>

      <Section icon="promise" label="公約と実績の照合">
        {incumbent.promises.map((promise, i) => (
          <div key={`${promise.title}-${i}`} style={{
            padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid #f2f2f2",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 5 }}>
              <div style={{ fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#222", fontWeight: 700, lineHeight: 1.55 }}>
                {promise.title}
              </div>
              <PromiseStatus status={promise.status} />
            </div>
            <div style={{ fontSize: 11.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#777", lineHeight: 1.7 }}>
              {promise.evidence}
            </div>
          </div>
        ))}
      </Section>

      <Section icon="report" label="活動報告">
        {incumbent.activityReports.map((report, i) => (
          <div key={`${report.title}-${i}`} style={{
            padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid #f2f2f2",
          }}>
            <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", marginBottom: 3 }}>
              {report.date}
            </div>
            <div style={{ fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#222", fontWeight: 700, marginBottom: 3 }}>
              {report.title}
            </div>
            <div style={{ fontSize: 11.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#777", lineHeight: 1.7 }}>
              {report.summary}
            </div>
          </div>
        ))}
      </Section>
    </article>
  );
}

export default async function IncumbentsPage() {
  const incumbents = await getIncumbents();

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
        <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", letterSpacing: "0.16em", marginBottom: 7 }}>
          INCUMBENTS
        </div>
        <div style={{ fontSize: 18, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", letterSpacing: "0.06em" }}>
          現職議員を見る
        </div>
        <div style={{ fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", lineHeight: 1.8, marginTop: 7 }}>
          発言・賛否・公約・活動を同じ形式で確認できます
        </div>
      </div>

      <div style={{ padding: "0 14px 34px" }}>
        {incumbents.map(incumbent => (
          <IncumbentCard key={incumbent.id} incumbent={incumbent} />
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "0 0 32px", fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#d0d0d0", letterSpacing: "0.12em" }}>
        分かるから、選べる
      </div>
    </div>
  );
}
