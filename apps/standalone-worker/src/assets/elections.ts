interface ElectionYear {
  year: number;
  current: boolean;
}

/** @deprecated use apps/update-command/src/assets/elections.ts */
export const ElectionYears: ElectionYear[] = [
  {
    year: 2022,
    current: true,
  },
  {
    year: 2020,
    current: false,
  },
  {
    year: 2018,
    current: false,
  },
  {
    year: 2016,
    current: false,
  },
];
