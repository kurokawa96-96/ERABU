import { Election, RegionGroup } from "@/lib/types";

export const PREFECTURE_TO_REGION: Record<string, string> = {
  "北海道": "北海道・東北",
  "青森県": "北海道・東北", "岩手県": "北海道・東北", "宮城県": "北海道・東北",
  "秋田県": "北海道・東北", "山形県": "北海道・東北", "福島県": "北海道・東北",
  "茨城県": "関東", "栃木県": "関東", "群馬県": "関東",
  "埼玉県": "関東", "千葉県": "関東", "東京都": "関東", "神奈川県": "関東",
  "新潟県": "中部", "富山県": "中部", "石川県": "中部", "福井県": "中部",
  "山梨県": "中部", "長野県": "中部", "岐阜県": "中部", "静岡県": "中部", "愛知県": "中部",
  "三重県": "近畿", "滋賀県": "近畿", "京都府": "近畿",
  "大阪府": "近畿", "兵庫県": "近畿", "奈良県": "近畿", "和歌山県": "近畿",
  "鳥取県": "中国・四国", "島根県": "中国・四国", "岡山県": "中国・四国",
  "広島県": "中国・四国", "山口県": "中国・四国",
  "徳島県": "中国・四国", "香川県": "中国・四国", "愛媛県": "中国・四国", "高知県": "中国・四国",
  "福岡県": "九州・沖縄", "佐賀県": "九州・沖縄", "長崎県": "九州・沖縄",
  "熊本県": "九州・沖縄", "大分県": "九州・沖縄", "宮崎県": "九州・沖縄",
  "鹿児島県": "九州・沖縄", "沖縄県": "九州・沖縄",
};

const REGION_ORDER = [
  "北海道・東北", "関東", "中部", "近畿", "中国・四国", "九州・沖縄",
];

export function groupElectionsByRegion(elections: Election[]): RegionGroup[] {
  const map = new Map<string, Map<string, Map<string, Election[]>>>();

  for (const election of elections) {
    const region = PREFECTURE_TO_REGION[election.prefecture] ?? "その他";
    const pref = election.prefecture;
    const city = election.city;

    if (!map.has(region)) map.set(region, new Map());
    const prefMap = map.get(region)!;
    if (!prefMap.has(pref)) prefMap.set(pref, new Map());
    const cityMap = prefMap.get(pref)!;
    if (!cityMap.has(city)) cityMap.set(city, []);
    cityMap.get(city)!.push(election);
  }

  return REGION_ORDER
    .filter(r => map.has(r))
    .map(region => ({
      region,
      prefectures: Array.from(map.get(region)!.entries()).map(([prefecture, cityMap]) => ({
        prefecture,
        cities: Array.from(cityMap.entries()).map(([city, elections]) => ({
          city,
          elections,
        })),
      })),
    }));
}

export function sortByElectionDate(elections: Election[]): Election[] {
  return [...elections].sort(
    (a, b) => new Date(a.electionDate).getTime() - new Date(b.electionDate).getTime()
  );
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
