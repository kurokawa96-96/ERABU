"use client";

import React from "react";
import Link from "next/link";

function Icon({ type, size = 16, color = "#666" }: { type: string; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 20 20", fill: "none" as const };
  const m: Record<string, React.ReactElement> = {
    back:  <svg {...p}><path d="M12.5 5L7.5 10L12.5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    shield:<svg {...p}><path d="M10 2L3 5v5c0 4.5 3 8 7 9 4-1 7-4.5 7-9V5L10 2Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
    chart: <svg {...p}><rect x="2" y="10" width="4" height="8" rx="0.5" stroke={color} strokeWidth="1.3"/><rect x="8" y="6" width="4" height="12" rx="0.5" stroke={color} strokeWidth="1.3"/><rect x="14" y="2" width="4" height="16" rx="0.5" stroke={color} strokeWidth="1.3"/></svg>,
    link:  <svg {...p}><path d="M8 12l-2 2a3 3 0 004.24 4.24l4-4A3 3 0 0010 10" stroke={color} strokeWidth="1.4" strokeLinecap="round"/><path d="M12 8l2-2a3 3 0 00-4.24-4.24l-4 4A3 3 0 0010 10" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>,
    info:  <svg {...p}><circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.4"/><path d="M10 9v5M10 6.5v.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/></svg>,
  };
  return m[type] ?? null;
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 9, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.2em", marginBottom: 12 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "16px 18px", marginBottom: 8 }}>
      {children}
    </div>
  );
}

function Row({ icon, title, value, sub, last }: {
  icon: string; title: string; value?: string; sub?: string; last?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      paddingBottom: last ? 0 : 14, marginBottom: last ? 0 : 14,
      borderBottom: last ? "none" : "1px solid #f4f4f4",
    }}>
      <div style={{ paddingTop: 1 }}><Icon type={icon} size={16} color="#999" /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", marginBottom: 3, letterSpacing: "0.03em" }}>
          {title}
        </div>
        {value && <div style={{ fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: 1.75 }}>{value}</div>}
        {sub && <div style={{ fontSize: 10.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#aaa", marginTop: 4, lineHeight: 1.6 }}>{sub}</div>}
      </div>
    </div>
  );
}
export default function AboutPage() {
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
        <div style={{ fontSize: 21, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.22em", color: "#1a1a1a" }}>ERABU</div>
        <div style={{ width: 20 }} />
      </div>

      {/* Hero */}
      <div style={{
        padding: "28px 24px 24px", textAlign: "center",
        borderBottom: "1px solid #ebebeb", background: "#fff", marginBottom: 20,
      }}>
        <div style={{ fontSize: 26, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.25em", color: "#1a1a1a", marginBottom: 8 }}>
          ERABU
        </div>
        <div style={{ fontSize: 13, fontFamily: "'Noto Serif JP', serif", color: "#888", letterSpacing: "0.08em", lineHeight: 1.8 }}>
          分かるから、選べる
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* ミッション */}
        <Section label="MISSION">
          <Card>
            <div style={{
              fontSize: 13, fontFamily: "'Noto Serif JP', serif",
              color: "#2a2a2a", lineHeight: 2.1, letterSpacing: "0.04em",
              whiteSpace: "pre-line",
            }}>
              {`ERABUは、「選挙で、誰を選んだらいいかわからない」という声から始まりました。

関心がないのではなく、候補者の思想や理念が有権者まで届いていない。

わたしたちはそれを、情報の問題だと考えています。

一票でも多く、意味のある選択に。
見て、考えて、選べる場所をつくることが、ERABUの使命です。`}
            </div>
          </Card>
        </Section>

        {/* 運営方針 */}
        <Section label="運営方針">
          <Card>
            <Row
              icon="shield"
              title="独立性の保持"
              value="特定の政党・候補者・行政機関から独立した運営を行います。"
              sub="支援団体であっても、掲載内容・編集方針への介入は一切認めません。この原則は定款に明記されています。"
            />
            <Row
              icon="info"
              title="非営利運営"
              value="ERABUは社会への価値提供を目的とし、利益の最大化を目指しません。"
              sub="収益は運営の存続に必要な範囲にとどめ、余剰は機能改善と情報の充実に充当します。"
              last
            />
          </Card>
        </Section>

        {/* 資金の透明性 */}
        <Section label="資金の透明性">
          <Card>
            <div style={{ fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", letterSpacing: "0.1em", marginBottom: 14 }}>
              収入内訳
            </div>
            {[
              { label: "候補者サブスクリプション", pct: 58, color: "#2D4A6B" },
              { label: "データAPI（研究・報道機関）", pct: 27, color: "#3D5A48" },
              { label: "助成金・寄付", pct: 15, color: "#5C3D2E" },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#444" }}>{item.label}</span>
                  <span style={{ fontSize: 11.5, fontFamily: "'Noto Sans JP', sans-serif", color: item.color, fontWeight: 700 }}>{item.pct}%</span>
                </div>
                <div style={{ height: 4, background: "#f0f0f0", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
            <div style={{
              marginTop: 14, paddingTop: 12, borderTop: "1px solid #f4f4f4",
              fontSize: 10.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", lineHeight: 1.7,
            }}>
              収支報告書は毎年度末に本ページにて全文公開します。
            </div>
          </Card>
        </Section>

        {/* 支援団体 */}
        <Section label="支援団体">
          <Card>
            {[
              { name: "〇〇財団", purpose: "市民参加・民主主義の促進", note: "コンテンツへの介入なし" },
              { name: "〇〇基金", purpose: "情報アクセスの平等化", note: "コンテンツへの介入なし", last: true },
            ].map((org, i) => (
              <div key={i} style={{
                paddingBottom: org.last ? 0 : 14, marginBottom: org.last ? 0 : 14,
                borderBottom: org.last ? "none" : "1px solid #f4f4f4",
              }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a", marginBottom: 3 }}>
                  {org.name}
                </div>
                <div style={{ fontSize: 11.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#666", marginBottom: 3 }}>
                  助成目的：{org.purpose}
                </div>
                <div style={{ fontSize: 10.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb" }}>
                  {org.note}
                </div>
              </div>
            ))}
          </Card>
          <div style={{ fontSize: 10.5, fontFamily: "'Noto Sans JP', sans-serif", color: "#bbb", lineHeight: 1.7, padding: "0 4px" }}>
            支援団体はいかなる場合もERABUの掲載内容・編集方針に介入する権限を持ちません。
          </div>
        </Section>

       {/* お問い合わせ */}
<Section label="CONTACT">
  <Card>
    <div style={{ fontSize: 12, fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: 1.8, marginBottom: 14 }}>
      掲載申請・情報の誤り報告・データ利用のご相談など、お気軽にご連絡くださいませ。
    </div>
    <a
    　href="https://docs.google.com/forms/d/e/1FAIpQLSejDYoL3o8IWFPsREN3f5h1TiNbFaLnjfzO8vJs4Bg8Uis9bQ/viewform" 
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        width: "100%", padding: 12, background: "#1a1a1a",
        color: "#fff", borderRadius: 9, textDecoration: "none",
        fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif",
        letterSpacing: "0.05em", boxSizing: "border-box",
      }}
    >
      お問い合わせフォームを開く
    </a>
  </Card>
</Section>

      </div>

      <div style={{ textAlign: "center", padding: "0 0 32px", fontSize: 10, fontFamily: "'Noto Sans JP', sans-serif", color: "#d0d0d0", letterSpacing: "0.12em" }}>
        分かるから、選べる
      </div>
    </div>
  );
}
