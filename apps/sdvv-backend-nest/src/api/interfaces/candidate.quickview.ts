export interface RaisedVsSpent {
  id: string;
  raised: number;
  spent: number;
  averageDonation: number;
}

export interface RaisedInOut {
  id: string;
  inside: number;
  outside: number;
  areaName: string; // Example: 'City of San Diego'
  jurisdiction: string; // Example: 'City' || 'District'
  jurisdictionSuffix?: string; // Examples: '1', '5'
}

export interface OutsideMoney {
  id: string;
  support: number;
  oppose: number;
  scale?: number;
}

interface Group {
  name: string;
  amount: number;
  percent: number;
}

export interface DonationsByGroup {
  id: string;
  groups: Array<Group>;
}

export interface CandidateQuickView {
  id: string;
  raisedVsSpent: RaisedVsSpent;
  donationsByGroupData: DonationsByGroup;
  raisedInOut: RaisedInOut;
  outsideMoney: OutsideMoney;
}
