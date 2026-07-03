"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

const COSTS = [
  { label: "選挙ポスター印刷（300枚）", amount: "約 30,000円" },
  { label: "チラシ・ビラ印刷（5,000枚）", amount: "約 50,000円" },
  { label: "選挙カー（1週間）", amount: "約 150,000円" },
  { label: "ハガキ（2,000枚）", amount: "約 80,000円" },
];

const PLANS = [
  {
    id: "monthly",
    label: "月額プラン",
    price: "3,000",
    unit: "円 / 月",
    note: "いつでも解約可能",
    badge: null,
    url: "https://buy.stripe.com/9B628jbq8g47alZ4bQcQU00",
  },
  {
    id: "yearly",
    label: "年額プラン",
    price: "30,000",
    unit: "円 / 年",
    note: "2ヶ月分お得",
    badge: "おすすめ",
    url: "https://buy.stripe.com/test_9B628jbq8g47alZ4bQcQU00",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const planRef = useRef<HTMLDivElement>(null);

  const scrollToPlan = () => {
    planRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{
      maxWidth: 390, margin: "0 auto", minHeight: "100vh",
      background: "#f5f4f0", fontFamily: "'Noto Sans JP', sans-serif",
    }}>
      {/* ヘッダー */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8e4dc",
        padding: "0 20px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={() => router.back()} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 22, color: "#888", padding: 0, lineHeight: 1,
        }}>‹</button>
        <span style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em", color: "#1a1a1a" }}>
          ERABU
        </span>
        <div style={{ width: 24 }} />
      </div>

      <div style={{ padding: "36px 20px 60px" }}>

        {/* 運営からのメッセージ */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #e8e4dc",
          padding: "28px 22px", marginBottom: 20,
        }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#c0b8a8", marginBottom: 20 }}>
            MESSAGE
          </div>

          <div style={{
            fontSize: 13.5, fontFamily: "'Noto Serif JP', serif",
            color: "#1a1a1a", lineHeight: 2.1,
          }}>
            ERABUは、候補者一人ひとりの想いや理念、政策を、有権者へまっすぐ届けるためのサービスです。
          </div>

          <div style={{ height: 1, background: "#f0ece4", margin: "20px 0" }} />

          <div style={{
            fontSize: 13, fontFamily: "'Noto Serif JP', serif",
            color: "#3a3a3a", lineHeight: 2.1,
          }}>
            <p style={{ margin: "0 0 16px" }}>
              選挙期間だけでは伝えきれない考えや、人柄、これまでの歩みを、ご自身の言葉で残していただけます。
            </p>
            <p style={{ margin: "0 0 16px" }}>
              スローガンでは伝わりきれないあなたの想いを、より深く、より具体的に届ける手段としてご活用いただけます。
            </p>
            <p style={{ margin: "0 0 16px" }}>
              SNSでは流れてしまう情報も、チラシでは伝えきれない想いも、ここではいつでも読み返すことができます。
            </p>
            <p style={{ margin: "0 0 16px" }}>
              地方の小さな自治体の選挙であっても、顔の見える一人ひとりに向けた政治を行うという意思を示す場としても、ぜひご活用ください。
            </p>
            <p style={{ margin: 0 }}>
              あなたが何を目指し、どんな未来を描いているのか。<br />
              その一つひとつが、有権者が「選ぶ」ための大切な材料になります。
            </p>
          </div>

          <div style={{ height: 1, background: "#f0ece4", margin: "24px 0" }} />

          <div style={{
            fontSize: 13, fontFamily: "'Noto Serif JP', serif",
            color: "#6a6050", lineHeight: 1.9, marginBottom: 24,
          }}>
            ぜひ、ご自身のページを作成し、あなたの言葉を届けてください。
          </div>

          <button
            onClick={scrollToPlan}
            style={{
              width: "100%", padding: 14,
              background: "#1a1a1a", color: "#fff",
              border: "none", borderRadius: 10,
              fontSize: 13, fontFamily: "'Noto Sans JP', sans-serif",
              cursor: "pointer", letterSpacing: "0.08em",
            }}
          >
            プランを見る
          </button>
        </div>

        {/* 選挙コスト比較 */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #e8e4dc",
          padding: "20px 18px", marginBottom: 14,
        }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#c0b8a8", marginBottom: 16 }}>
            一般的な選挙活動のコスト
          </div>
          {COSTS.map((c, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "11px 0",
              borderBottom: i < COSTS.length - 1 ? "1px solid #f0ece4" : "none",
            }}>
              <span style={{ fontSize: 12.5, color: "#5a5040" }}>{c.label}</span>
              <span style={{ fontSize: 13, fontFamily: "'Cormorant Garamond', serif", color: "#1a1a1a", letterSpacing: "0.05em" }}>
                {c.amount}
              </span>
            </div>
          ))}
          <div style={{
            marginTop: 14, padding: "12px 14px",
            background: "#f5f4f0", borderRadius: 9,
            fontSize: 12, color: "#8a8070", lineHeight: 1.8,
          }}>
            選挙活動には数十万円のコストがかかります。<br />
            ERABUなら低コストで有権者に直接届きます。
          </div>
        </div>

        {/* プラン */}
        <div ref={planRef} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#c0b8a8", marginBottom: 14, paddingLeft: 2 }}>
            プランを選ぶ
          </div>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: "#fff", borderRadius: 14,
              border: plan.id === "yearly" ? "2px solid #1a1a1a" : "1px solid #e8e4dc",
              padding: "20px 18px", marginBottom: 10,
              position: "relative",
            }}>
              {plan.badge && (
                <div style={{
                  position: "absolute", top: -10, right: 16,
                  background: "#1a1a1a", color: "#fff",
                  fontSize: 10, padding: "3px 10px", borderRadius: 10,
                  fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: "0.1em",
                }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 13, color: "#8a8070", marginBottom: 4 }}>{plan.label}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", color: "#1a1a1a", letterSpacing: "0.05em" }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: 12, color: "#a09880" }}>{plan.unit}</span>
                  </div>
                </div>
                <div style={{
                  fontSize: 11, color: "#a09880",
                  background: "#f5f4f0", borderRadius: 8,
                  padding: "4px 10px", marginTop: 4,
                }}>
                  {plan.note}
                </div>
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12, color: "#6a6050", lineHeight: 2 }}>
                <li>プロフィール・政策を自由に編集</li>
                <li>お知らせ・スケジュールの掲載</li>
                <li>公式サイトへのリンク掲載</li>
                <li>更新履歴の自動記録</li>
              </ul>
              <button
                onClick={() => window.location.href = plan.url}
                style={{
                  width: "100%", marginTop: 16, padding: 13,
                  background: plan.id === "yearly" ? "#1a1a1a" : "#fff",
                  color: plan.id === "yearly" ? "#fff" : "#1a1a1a",
                  border: plan.id === "yearly" ? "none" : "1.5px solid #1a1a1a",
                  borderRadius: 10, fontSize: 13,
                  fontFamily: "'Noto Sans JP', sans-serif",
                  cursor: "pointer", letterSpacing: "0.08em",
                }}
              >
                このプランで登録する
              </button>
            </div>
          ))}
        </div>

        {/* 注意書き */}
        <div style={{ fontSize: 11, color: "#c0b8a8", lineHeight: 1.9, padding: "0 4px" }}>
          ※ 料金はすべて税込です。<br />
          ※ 自動更新となります。解約はマイページよりいつでも可能です。<br />
          ※ 決済にはクレジットカードが必要です。<br />
          ※ ご不明な点はお問い合わせください。
        </div>
      </div>
    </div>
  );
}
