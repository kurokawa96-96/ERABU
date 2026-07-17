// Keep this file aligned with ERABU's public JSON contract.
// Future preferred shape:
// export type { Election as ErabuElection } from "erabu/lib/types";

export type ErabuElectionStatus = "upcoming" | "ongoing" | "past";

export type ErabuElectionType =
  | "city_assembly"
  | "mayor"
  | "governor"
  | "prefecture_assembly"
  | "house_of_representatives"
  | "house_of_councillors"
  | "referendum"
  | "unknown";

export interface ErabuElection {
  id: string;
  regionId: string;
  prefectureId: string;
  prefectureName: string;
  cityId?: string;
  cityName?: string;
  name: string;
  type: ErabuElectionType;
  announcementDate?: string;
  electionDate: string;
  status?: ErabuElectionStatus;
  sourceUrl?: string;
}

export interface ErabuPolicy {
  title: string;
  body?: string;
  category?: string;
  sourceUrl?: string;
}

export interface ErabuCandidate {
  id: string;
  electionId: string;
  name: string;
  partyName?: string;
  tagline?: string;
  message?: string;
  profile?: string;
  policies?: ErabuPolicy[];
  sourceUrl?: string;
}

export interface ErabuJsonBundle {
  elections: ErabuElection[];
  candidates: ErabuCandidate[];
}
