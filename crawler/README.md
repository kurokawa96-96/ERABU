# ERABU election data pipeline

全国の選挙情報・候補者情報を公的ソースから取得し、ERABU の JSON 形式へ変換するための拡張用雛形です。

現時点ではアーキテクチャと型の骨組みのみを置いています。スクレイピング、API クライアント、本番向けジョブはまだ実装していません。

## ディレクトリ構成

```text
src/
  collect/      ソース別の取得口
  normalize/    取得データから ERABU JSON への変換
  export/       ERABU 互換 JSON の保存
  types/        取得データと ERABU 互換出力の共通型
```

## パイプライン

```text
collect -> normalize -> export
```

1. `collect` で e-Stat、総務省、都道府県選管、市区町村選管などから取得します。
2. `normalize` で取得元ごとの生データを ERABU 互換の `elections.json` / `candidates.json` へ変換します。
3. `export` で変換済み JSON を保存します。

## 対応予定ソース

- e-Stat
- 総務省
- 都道府県選挙管理委員会
- 市区町村選挙管理委員会

## 取得処理の配置

全国対応を見据え、自治体ごとにファイルを分けます。

```text
src/collect/sources/
  estat/
    index.ts
  soumu/
    index.ts
  prefectures/
    index.ts
    tokyo.ts
  municipalities/
    index.ts
    tokyo/
      nakano.ts
```

市区町村の取得処理を追加する場合は、以下にファイルを追加します。

```text
src/collect/sources/municipalities/{prefecture-slug}/{municipality-slug}.ts
```

例:

```text
src/collect/sources/municipalities/tokyo/nakano.ts
```

都道府県単位の取得処理は以下に追加します。

```text
src/collect/sources/prefectures/{prefecture-slug}.ts
```

## 市区町村 collector の追加例

`Collector` を export します。

```ts
import type { Collector } from "../../../../types/source.js";
import { createEmptyCollectionResult } from "../../../empty-result.js";

const source = {
  id: "municipality:tokyo:nakano",
  label: "中野区選挙管理委員会",
  kind: "municipality",
  prefecture: "東京都",
  municipality: "中野区"
} as const;

export const nakanoCollector: Collector = {
  source,
  async collect() {
    return createEmptyCollectionResult(source);
  }
};
```

追加後、`src/collect/sources/municipalities/index.ts` に登録します。

## ERABU 型定義の共有方針

`src/types/erabu.ts` は ERABU 本体の JSON 契約に合わせるための互換レイヤーです。

ERABU 本体が型を package や `lib/types.ts` から公開している場合は、このファイルを type-only import / re-export に差し替えてください。

```ts
export type { Election as ErabuElection } from "erabu/lib/types";
```

候補者や政策など、ERABU 本体からまだ公開されていない型だけをローカル互換型として残す方針です。

## JSON 形式の設計メモ

地域は表示名と安定 ID を分けます。

- `prefectureId`: 都道府県の安定 ID
- `prefectureName`: 表示名
- `cityId`: 市区町村の安定 ID
- `cityName`: 表示名
- `regionId`: 検索や紐付けに使う代表地域 ID

選挙種別は自由文字列ではなく、`ErabuElectionType` に正規化します。

```ts
type ErabuElectionType =
  | "city_assembly"
  | "mayor"
  | "governor"
  | "prefecture_assembly"
  | "house_of_representatives"
  | "house_of_councillors"
  | "referendum"
  | "unknown";
```

取得元で「市議選」「市議会議員選挙」「市議会」のように表記が揺れても、ERABU JSON では `city_assembly` のような値に寄せます。元の表記は必要に応じて `RawElectionRecord.electionTypeText` に残します。

`status` は optional です。日付から `upcoming` / `ongoing` / `past` を計算できる場合、保存せず表示側や検索側で算出する選択肢を残します。

候補者情報は自治体サイトで取得できない項目が多いため、本文系の項目は optional です。

- `partyName`
- `tagline`
- `message`
- `profile`
- `sourceUrl`

`sourceUrl` は「この候補者情報の出典はどこか」を追えるように、候補者単位でも持てる設計にしています。

## 現在の雛形

- `src/collect/sources/estat/index.ts`: e-Stat 用の取得口
- `src/collect/sources/soumu/index.ts`: 総務省用の取得口
- `src/collect/sources/prefectures/tokyo.ts`: 都道府県選管の追加例
- `src/collect/sources/municipalities/tokyo/nakano.ts`: 市区町村選管の追加例
- `src/normalize/election.ts`: 選挙情報の変換口
- `src/normalize/candidate.ts`: 候補者情報の変換口
- `src/export/json-file.ts`: `elections.json` / `candidates.json` の保存口
