"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export default function ElectionCalendar() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [elections, setElections] = useState<Election[]>([]);
  const [popup, setPopup] = useState<{ day: number; elections: Election[] } | null>(null);

  useEffect(() => {
    fetch("/api/elections")
      .then(r => r.json())
      .then(d => setElections(Array.isArray(d) ? d : []));
  }, []);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  // その月の選挙を日付でマップ
  const electionMap: Record<number, Election[]> = {};
  elections.forEach(el => {
    if (!el.electionDate) return;
    const d = new Date(el.electionDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!electionMap[day]) electionMap[day] = [];
      electionMap[day].push(el);
    }
  });

  // カレンダーグリッド生成
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // 6行になるよう末尾を埋める
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div style={{
      maxWidth: 390, margin: "0 auto", minHeight: "100vh",
      background: "#f5f4f0", fontFamily: "'Noto Sans JP', sans-serif",
    }}>
      {/* ヘッダー */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8e8e8",
        padding: "0 20px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em", color: "#1a1a1a" }}>
          ERABU
        </span>
        <span style={{ fontSize: 10, color: "#bbb", letterSpacing: "0.15em" }}>選挙カレンダー</span>
      </div>

      {/* 月ナビゲーション */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 24px 12px",
      }}>
        <button onClick={prevMonth} style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#fff", border: "1px solid #e0e0e0",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "#888",
        }}>‹</button>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.1em", color: "#1a1a1a" }}>
            {year}
          </div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>
            {month + 1}月
          </div>
        </div>

        <button onClick={nextMonth} style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#fff", border: "1px solid #e0e0e0",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, color: "#888",
        }}>›</button>
      </div>

      {/* カレンダー本体 */}
      <div style={{ padding: "0 16px 24px" }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #ebebeb", overflow: "hidden" }}>

          {/* 曜日ヘッダー */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #f0f0f0" }}>
            {WEEKDAYS.map((w, i) => (
              <div key={w} style={{
                textAlign: "center", padding: "10px 0", fontSize: 10,
                color: i === 0 ? "#e07070" : i === 6 ? "#7090e0" : "#bbb",
                letterSpacing: "0.05em",
              }}>{w}</div>
            ))}
          </div>

          {/* 日付グリッド */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {cells.map((day, idx) => {
              const colIndex = idx % 7;
              const hasElection = day !== null && !!electionMap[day];
              const todayFlag = day !== null && isToday(day);

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (day && hasElection) setPopup({ day, elections: electionMap[day] });
                  }}
                  style={{
                    minHeight: 56, padding: "8px 4px 6px",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    borderRight: colIndex < 6 ? "1px solid #f8f8f8" : "none",
                    borderBottom: idx < cells.length - 7 ? "1px solid #f8f8f8" : "none",
                    cursor: hasElection ? "pointer" : "default",
                    background: hasElection ? "#fafaf7" : "#fff",
                    transition: "background 0.15s",
                  }}
                >
                  {day !== null && (
                    <>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: todayFlag ? "#1a1a1a" : "transparent",
                        fontSize: 12,
                        color: todayFlag ? "#fff" : colIndex === 0 ? "#e07070" : colIndex === 6 ? "#7090e0" : "#1a1a1a",
                        fontWeight: todayFlag ? 600 : 400,
                      }}>
                        {day}
                      </div>
                      {hasElection && (
                        <div style={{
                          marginTop: 4,
                          background: "#1a6e3c",
                          color: "#fff",
                          fontSize: 9,
                          fontFamily: "'Noto Serif JP', serif",
                          borderRadius: 4,
                          padding: "1px 5px",
                          letterSpacing: "0.05em",
                        }}>
                          選
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* その月の選挙件数 */}
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#bbb" }}>
          {Object.keys(electionMap).length > 0
            ? `この月に${Object.values(electionMap).flat().length}件の選挙があります`
            : "この月の選挙はありません"}
        </div>
      </div>

      {/* ポップアップ */}
      {popup && (
        <div
          onClick={() => setPopup(null)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 390,
              background: "#fff", borderRadius: "20px 20px 0 0",
              padding: "20px 20px 36px",
            }}
          >
            {/* ハンドル */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "0 auto 18px" }} />

            <div style={{ fontSize: 11, color: "#bbb", marginBottom: 4 }}>
              {year}年{month + 1}月{popup.day}日
            </div>
            <div style={{ fontSize: 15, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a", marginBottom: 18 }}>
              {popup.elections.length}件の選挙
            </div>

            {popup.elections.map(el => (
              <button
                key={el.id}
                onClick={() => router.push(`/election/${el.id}`)}
                style={{
                  width: "100%", textAlign: "left",
                  background: "#fafaf8", border: "1px solid #ebebeb",
                  borderRadius: 12, padding: "14px 16px", marginBottom: 10,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 10, color: "#aaa", marginBottom: 3 }}>
                  {el.prefecture} {el.city}
                </div>
                <div style={{ fontSize: 14, fontFamily: "'Noto Serif JP', serif", color: "#1a1a1a" }}>
                  {el.name}
                </div>
                <div style={{ fontSize: 10, color: "#bbb", marginTop: 3 }}>
                  {el.type} › 詳細を見る
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
