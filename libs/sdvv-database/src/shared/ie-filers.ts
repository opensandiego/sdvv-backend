import { IndependentExpenditureFiler } from '../api/candidates/independent-expenditures/interfaces/independent-expenditures.interface';

export function getIEFilers({
  transactions,
  supp_opp_cd,
}: {
  transactions: {
    filer_naml: string;
    amount: number;
    supp_opp_cd?: string;
  }[];
  supp_opp_cd: 'SUPPORT' | 'OPPOSE';
}) {
  const filerMap = new Map<string, IndependentExpenditureFiler>();

  transactions
    .filter((transaction) => transaction.supp_opp_cd === supp_opp_cd)
    .forEach((transaction) => {
      // add filer to map if filer does not already exists
      if (!filerMap.has(transaction.filer_naml)) {
        filerMap.set(transaction.filer_naml, {
          filerName: transaction.filer_naml,
          amount: 0,
        });
      }

      const filer = filerMap.get(transaction.filer_naml);
      if (!filer) return;

      filer.amount = filer.amount + Number(transaction.amount || 0);
    });

  return Array.from(filerMap.values());
}
