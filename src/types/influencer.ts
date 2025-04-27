
export type Platform = 'instagram' | 'youtube';

export interface GenderSplit {
  male: number;
  female: number;
  other: number;
}

export interface AgeSplit {
  '13-17': number;
  '18-24': number;
  '25-34': number;
  '35-44': number;
  '45-54': number;
  '55+': number;
}

export interface StateSplit {
  [state: string]: number;
}

export interface InfluencerData {
  id: string;
  username: string;
  platform: Platform;
  profilePicture?: string;
  followerCount: number;
  location: string;
  contentLanguage: string;
  averageViews: number;
  averageReach: number;
  averageBrandedViews: number;
  genderSplit: GenderSplit;
  stateSplit: StateSplit;
  ageSplit: AgeSplit;
  lastUpdated: string;
}

export interface GoogleSheetRow {
  id: string;
  username: string;
  platform: Platform;
}

export interface InfluencerAnalytics {
  influencerData: InfluencerData[];
  isLoading: boolean;
  error: string | null;
}
