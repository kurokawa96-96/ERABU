export type ElectionStatus = "upcoming" | "ongoing" | "past";

export interface Election {
  id: string;
  prefecture: string;
  city: string;
  name: string;
  type: string;
  announcementDate?: string;
  electionDate: string;
  status: ElectionStatus;
}

export interface CityGroup {
  city: string;
  elections: Election[];
}

export interface PrefectureGroup {
  prefecture: string;
  cities: CityGroup[];
}

export interface RegionGroup {
  region: string;
  prefectures: PrefectureGroup[];
}

export interface IncumbentBillVote {
  bill: string;
  category: string;
  vote: "賛成" | "反対" | "棄権" | "欠席";
  date: string;
}

export interface IncumbentPromise {
  title: string;
  status: "達成" | "進行中" | "未着手" | "変更";
  evidence: string;
}

export interface IncumbentActivityReport {
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
  billVotes: IncumbentBillVote[];
  promises: IncumbentPromise[];
  activityReports: IncumbentActivityReport[];
}
