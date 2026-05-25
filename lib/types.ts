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
