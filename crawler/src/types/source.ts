import type { ErabuElectionStatus, ErabuElectionType } from "./erabu.js";

export type SourceKind = "estat" | "soumu" | "prefecture" | "municipality";

interface BaseSourceDescriptor {
  id: string;
  label: string;
  kind: SourceKind;
  url?: string;
}

export interface NationalSourceDescriptor extends BaseSourceDescriptor {
  kind: "estat" | "soumu";
}

export interface PrefectureSourceDescriptor extends BaseSourceDescriptor {
  kind: "prefecture";
  prefecture: string;
}

export interface MunicipalitySourceDescriptor extends BaseSourceDescriptor {
  kind: "municipality";
  prefecture: string;
  municipality: string;
}

export type SourceDescriptor =
  | NationalSourceDescriptor
  | PrefectureSourceDescriptor
  | MunicipalitySourceDescriptor;

export interface RawElectionRecord {
  sourceId: string;
  sourceRecordId?: string;
  regionId?: string;
  prefectureId?: string;
  prefectureName?: string;
  cityId?: string;
  cityName?: string;
  title?: string;
  electionType?: ErabuElectionType;
  electionTypeText?: string;
  announcementDate?: string;
  electionDate?: string;
  status?: ErabuElectionStatus;
  statusText?: string;
  sourceUrl?: string;
  raw: unknown;
}

export interface RawCandidateRecord {
  sourceId: string;
  sourceRecordId?: string;
  electionSourceRecordId?: string;
  name?: string;
  partyName?: string;
  party?: string;
  tagline?: string;
  message?: string;
  profile?: string;
  sourceUrl?: string;
  raw: unknown;
}

export interface CollectionResult {
  source: SourceDescriptor;
  elections: RawElectionRecord[];
  candidates: RawCandidateRecord[];
  fetchedAt: string;
}

export interface Collector {
  source: SourceDescriptor;
  collect(): Promise<CollectionResult>;
}
