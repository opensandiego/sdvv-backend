export type IndependentExpenditureFiler = {
  filerName: string;
  amount: number;
};

export type CandidateIndependentExpenditures = {
  candidateId: string;
  candidateName: string;
  inPrimaryElection: boolean;
  inGeneralElection: boolean;
  f460d: {
    support: IndependentExpenditureFiler[];
    oppose: IndependentExpenditureFiler[];
  };
  s496: {
    support: IndependentExpenditureFiler[];
    oppose: IndependentExpenditureFiler[];
  };
};
