"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";

export interface IncumbentPromise {
  title: string;
  status: "達成" | "進行中" | "未着手" | "変更";
  evidence: string;
}

export interface BillVote {
  bill: string;
  category: string;
  vote: string;
  date: string;
}

export interface ActivityReport {
  date: string;
  title: string;
  summary: string;
}

export interface Incumbent {
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

const PREFECTURE_ORDER: Record<string, number> = {
  "北海道":1,"青森県":2,"岩手県":3,"宮城県":4,"秋田県":5,
  "山形県":6,"福島県":7,"茨城県":8,"栃木県":9,"群馬県":10,
  "埼玉県":11,"千葉県":12,"東京都":13,"神奈川県":14,"新潟県":15,
  "富山県":16,"石川県":17,"福井県":18,"山梨県":19,"長野県":20,
  "岐阜県":21,"静岡県":22,"愛知県":23,"三重県":24,"滋賀県":25,
  "京都府":26,"大阪府":27,"兵庫県":28,"奈良県":29,"和歌山県":30,
  "鳥取県":31,"島根県":32,"岡山県":33,"広島県":34,"山口県":35,
  "徳島県":36,"香川県":37,"愛媛県":38,"高知県":39,"福岡県":40,
  "佐賀県":41,"長崎県":42,"熊本県":43,"大分県":44,"宮崎県":45,
  "鹿児島県":46,"沖縄県":47,
};

const sortByPref = (a: string, b: string) =>
  (PREFECTURE_ORDER[a] ?? 99) - (PREFECTURE_ORDER[b] ?? 99);

// 国政（衆議院・参議院）かどうかを役職名から判定する
// admin_page_v6.tsx の isNationalAssembly と同じ判定ロジック
// TODO: assemblyフィールドの入力規則が確定次第、この判定ロジックを見直すこと
const isNationalAssembly = (assembly: string) => /衆議院|参議院/.test(assembly ?? "");

const NATIONAL_CHAMBERS = ["衆議院", "参議院"] as const;

function Icon({ type, size = 16, color = "#666" }: { type: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none" as const };
  const m: Record<string, ReactElement> = {
    back:    <svg {...p}><path d="M12.5 5L7.5 10L12.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    forward: <svg {...p}><path d="M7.5 5L12.5 10L7.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    speech:  <svg {...p}><path d="M3 4h14v9H8l-5 4V4Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 8h6M7 11h4" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    vote:    <svg {...p}><rect x="3" y="3" width="14" height="14" rx="1.5" stroke={color} strokeWidth="1.4"/><path d="M6 10l2.5 2.5L14 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    promise: <svg {...p}><path d="M5 3h10v14H5V3Z" stroke={color} strokeWidth="1.4"/><path d="M8 7h4M8 10h4M8 13h2" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    report:  <svg {...p}><path d="M4 4h12v12H4V4Z" stroke={color} strokeWidth="1.4"/><path d="M7 8h6M7 11h6M7 14h3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>,
    national:<svg {...p}><path d="M10 3l7 3.5v1H3v-1L10 3Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/><path d="M4.5 7.5v7M8 7.5v7M12 7.5v7M15.5 7.5v7M3 17h14" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>,
    local:   <svg {...p}><path d="M10 17.5S4.5 12 4.5 8a5.5 5.5 0 0 1 11 0c0 4-5.5 9.5-5.5 9.5Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/><circle cx="10" cy="8" r="2" stroke={color} strokeWidth="1.4"/></svg>,
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
  return (
    <article style={{
      background: "#fff", border: "1px solid #ebebeb",
      borderRadius: 12, padding: "17px 16px", marginBottom: 12,
    }}>

      {/* ① 基本情報 */}
      <div style={{ marginBottom: 14 }}>
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

      <div style={{ height: 1, background: "#f0f0f0", marginBottom: 14 }} />

      {/* ② 理念・タグライン */}
      {incumbent.tagline && (
        <div style={{
          borderLeft: "2px solid #1a1a1a", paddingLeft: 12, marginBottom: 14,
          fontSize: 13, fontFamily: "'Noto Serif JP', serif",
          color: "#333", lineHeight: 1.8,
        }}>
          {incumbent.tagline}
        </div>
      )}

      {/* ③ メッセージ */}
      {incumbent.message && (
        <div style={{
          padding: "11px 13px", background: "#f8f8f6", borderRadius: 8, marginBottom: 14,
          fontSize: 12, fontFamily: "'Noto Serif JP', serif",
          color: "#3a3a3a", lineHeight: 1.9,
        }}>
          {incumbent.message}
        </div>
      )}

      {/* ④ 公約と進捗 */}
      <Section icon="promise" label="公約と進捗">
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

      {/* ⑤ 活動報告 */}
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

      {/* ⑥ 議会活動記録 */}
      <Section icon="speech" label="議会活動記録">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { label: "出席率", value: `${incumbent.attendanceRate}%` },
            { label: "発言", value: `${incumbent.speechCount}回` },
            { label: "質問", value: `${incumbent.questionCount}回` },
          ].map(item => (
            <div key={item.label} style={{ background: "#fafaf8", borderRadius: 9, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif", color: "#1a1a1a" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ⑦ 賛否記録 */}
      <Section icon="vote" label="重要議案への賛否">
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
              padding: "4px 8px",
              background: vote.vote === "反対" ? "#f8eeee" : "#eef5f1",
              color: vote.vote === "反対" ? "#9a5555" : "#2f6f4e",
              fontSize: 11, fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700,
            }}>
              {vote.vote}
            </div>
          </div>
        ))}
      </Section>
    </article>
  );
}

// ドリルダウン用の行アイテム（都道府県・市区町村・国政/地方の選択肢など）
function DrillRow({ label, count, icon, onClick }: { label: string; count: number; icon?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "15px 16px", background: "#fff", border: "1px solid #ebebeb",
      borderRadius: 12, marginBottom: 8, cursor: "pointer", textAlign: "left",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && (
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: "#f5f4f0",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon type={icon} size={16} color="#888" />
          </div>
        )}
        <div>
          <div style={{ fontSize: 14, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", letterSpacing: "0.03em" }}>
            {label}
          </div>
          <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", marginTop: 2 }}>
            {count}名
          </div>
        </div>
      </div>
      <Icon type="forward" size={15} color="#ccc" />
    </button>
  );
}

// パンくず＋戻るボタン付きのヘッダー
function DrillHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 4px 16px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, marginLeft: -4 }}>
        <Icon type="back" size={17} color="#1a1a1a" />
      </button>
      <span style={{ fontSize: 14, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", letterSpacing: "0.04em" }}>
        {title}
      </span>
    </div>
  );
}

type View =
  | { level: "root" }
  | { level: "national-chamber" }
  | { level: "national-list"; chamber: string }
  | { level: "local-pref" }
  | { level: "local-city"; prefecture: string }
  | { level: "local-list"; prefecture: string; city: string };

export default function IncumbentsBrowser({ incumbents }: { incumbents: Incumbent[] }) {
  const [view, setView] = useState<View>({ level: "root" });

  const national = incumbents.filter(inc => isNationalAssembly(inc.assembly));
  const local = incumbents.filter(inc => !isNationalAssembly(inc.assembly));

  const goBack = () => {
    if (view.level === "national-list") setView({ level: "national-chamber" });
    else if (view.level === "national-chamber") setView({ level: "root" });
    else if (view.level === "local-city") setView({ level: "local-pref" });
    else if (view.level === "local-list") setView({ level: "local-city", prefecture: view.prefecture });
    else if (view.level === "local-pref") setView({ level: "root" });
  };

  let content: ReactNode;
  let headerTitle: string | null = null;

  if (view.level === "root") {
    content = (
      <>
        <DrillRow
          label="国政"
          count={national.length}
          icon="national"
          onClick={() => setView({ level: "national-chamber" })}
        />
        <DrillRow
          label="地方"
          count={local.length}
          icon="local"
          onClick={() => setView({ level: "local-pref" })}
        />
      </>
    );
  } else if (view.level === "national-chamber") {
    headerTitle = "国政";
    content = (
      <>
        {NATIONAL_CHAMBERS.map(chamber => {
          const count = national.filter(inc => inc.assembly.includes(chamber)).length;
          return (
            <DrillRow
              key={chamber}
              label={chamber}
              count={count}
              onClick={() => setView({ level: "national-list", chamber })}
            />
          );
        })}
      </>
    );
  } else if (view.level === "national-list") {
    headerTitle = view.chamber;
    const list = national.filter(inc => inc.assembly.includes(view.chamber));
    content = list.length === 0 ? (
      <EmptyState />
    ) : (
      list.map(inc => <IncumbentCard key={inc.id} incumbent={inc} />)
    );
  } else if (view.level === "local-pref") {
    headerTitle = "地方";
    const prefs = Array.from(new Set(local.map(inc => inc.prefecture || "未設定"))).sort(sortByPref);
    content = prefs.map(pref => (
      <DrillRow
        key={pref}
        label={pref}
        count={local.filter(inc => (inc.prefecture || "未設定") === pref).length}
        onClick={() => setView({ level: "local-city", prefecture: pref })}
      />
    ));
  } else if (view.level === "local-city") {
    headerTitle = view.prefecture;
    const inPref = local.filter(inc => (inc.prefecture || "未設定") === view.prefecture);
    const cities = Array.from(new Set(inPref.map(inc => inc.city || "未設定"))).sort((a, b) => a.localeCompare(b, "ja"));
    content = cities.map(city => (
      <DrillRow
        key={city}
        label={city}
        count={inPref.filter(inc => (inc.city || "未設定") === city).length}
        onClick={() => setView({ level: "local-list", prefecture: view.prefecture, city })}
      />
    ));
  } else {
    headerTitle = `${view.prefecture} ${view.city}`;
    const list = local.filter(inc =>
      (inc.prefecture || "未設定") === view.prefecture && (inc.city || "未設定") === view.city
    );
    content = list.length === 0 ? (
      <EmptyState />
    ) : (
      list.map(inc => <IncumbentCard key={inc.id} incumbent={inc} />)
    );
  }

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
          理念・公約・活動を同じ形式で確認できます
        </div>
      </div>

      <div style={{ padding: "0 14px 34px" }}>
        {incumbents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb" }}>
            現職議員情報は準備中ですわ
          </div>
        ) : (
          <>
            {headerTitle && <DrillHeader title={headerTitle} onBack={goBack} />}
            {content}
          </>
        )}
      </div>

      <div style={{ textAlign: "center", padding: "0 0 32px", fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#d0d0d0", letterSpacing: "0.12em" }}>
        分かるから、選べる
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: "40px 0", fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb" }}>
      該当する現職議員情報は準備中ですわ
    </div>
  );
}
