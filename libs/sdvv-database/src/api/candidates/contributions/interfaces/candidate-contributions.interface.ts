export type ContributionsByForm = {
  inCity: number;
  outCity: number;
  formContributions: number;
  formTransactionCount: number;
};

export type CandidateContributionsByLocation = {
  candidateId: string;
  committeeName: string;
  candidateName: string;
  inPrimaryElection: boolean;
  inGeneralElection: boolean;
  year: string;
  office: string;
  district: string | undefined;
  f460a: ContributionsByForm;
  f460c: ContributionsByForm;
  f496p3: ContributionsByForm;
  // f497p1: ContributionsByForm;
  totalContributions: number;
  transactionCount: number;
};
