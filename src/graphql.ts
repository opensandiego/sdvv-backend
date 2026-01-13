
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum ContributionMethod {
    IN_KIND = "IN_KIND",
    INDIVIDUAL = "INDIVIDUAL",
    OTHER = "OTHER"
}

export enum ContributionLocation {
    IN_DISTRICT = "IN_DISTRICT",
    IN_CITY = "IN_CITY",
    IN_COUNTY = "IN_COUNTY",
    IN_STATE = "IN_STATE",
    OUT_OF_STATE = "OUT_OF_STATE"
}

export enum ContributionJurisdiction {
    IN = "IN",
    OUT = "OUT"
}

export enum ElectionType {
    PRIMARY = "PRIMARY",
    GENERAL = "GENERAL"
}

export interface CandidateFilters {
    years?: Nullable<Nullable<string>[]>;
    offices?: Nullable<Nullable<string>[]>;
    districts?: Nullable<Nullable<string>[]>;
    inPrimaryElection?: Nullable<boolean>;
    inGeneralElection?: Nullable<boolean>;
}

export interface TransactionFilters {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    lastFirstName?: Nullable<string>;
    zipCodes?: Nullable<Nullable<string>[]>;
    employers?: Nullable<Nullable<string>[]>;
    occupations?: Nullable<Nullable<string>[]>;
}

export interface YearCandidateFilters {
    inPrimaryElection?: Nullable<boolean>;
    inGeneralElection?: Nullable<boolean>;
}

export interface CommitteeFilters {
    inPrimaryElection?: Nullable<boolean>;
    inGeneralElection?: Nullable<boolean>;
}

export interface Candidate {
    id: string;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    fullName?: Nullable<string>;
    description?: Nullable<string>;
    imageUrl?: Nullable<string>;
    website?: Nullable<string>;
    jurisdictionName?: Nullable<string>;
    agency?: Nullable<string>;
    office?: Nullable<string>;
    district?: Nullable<string>;
    electionYear?: Nullable<string>;
    committeeName?: Nullable<string>;
    inGeneralElection?: Nullable<boolean>;
    inPrimaryElection?: Nullable<boolean>;
    fullOfficeName?: Nullable<string>;
    committee?: Nullable<Committee>;
    independentExpenditures?: Nullable<IndependentExpenditures>;
}

export interface IQuery {
    candidate(id: string): Nullable<Candidate> | Promise<Nullable<Candidate>>;
    candidates(year?: Nullable<string>, filters?: Nullable<CandidateFilters>): Nullable<Nullable<Candidate>[]> | Promise<Nullable<Nullable<Candidate>[]>>;
    committee(committeeName: string): Nullable<Committee> | Promise<Nullable<Committee>>;
    electionYears(): Nullable<Nullable<ElectionYear>[]> | Promise<Nullable<Nullable<ElectionYear>[]>>;
    electionYear(year: string, filters?: Nullable<YearCandidateFilters>): Nullable<ElectionYear> | Promise<Nullable<ElectionYear>>;
    lastUpdate(): Nullable<LastUpdate> | Promise<Nullable<LastUpdate>>;
    office(electionYear: string, title: string): Nullable<Office> | Promise<Nullable<Office>>;
}

export interface Committee {
    id?: Nullable<string>;
    name?: Nullable<string>;
    dashedName?: Nullable<string>;
    contributions?: Nullable<ContributionDetails>;
    expenses?: Nullable<Expenses>;
}

export interface Contribution {
    amount?: Nullable<number>;
    name?: Nullable<string>;
    lastName?: Nullable<string>;
    firstName?: Nullable<string>;
    date?: Nullable<string>;
    committee?: Nullable<string>;
    tranId?: Nullable<string>;
    city?: Nullable<string>;
    state?: Nullable<string>;
    zip?: Nullable<string>;
    employer?: Nullable<string>;
    occupation?: Nullable<string>;
}

export interface ContributionDetails {
    sum?: Nullable<number>;
    average?: Nullable<number>;
    count?: Nullable<number>;
    groupBy?: Nullable<ContributionsGroupBy>;
    categorizedBy?: Nullable<ContributionsSumBy>;
    transactions?: Nullable<Nullable<Contribution>[]>;
}

export interface ContributionGroup {
    name?: Nullable<string>;
    sum?: Nullable<number>;
    percent?: Nullable<number>;
    count?: Nullable<number>;
}

export interface ContributionZipCode {
    name?: Nullable<string>;
    sum?: Nullable<number>;
    percent?: Nullable<number>;
    count?: Nullable<number>;
}

export interface ContributionContributor {
    name?: Nullable<string>;
    sum?: Nullable<number>;
    percent?: Nullable<number>;
    count?: Nullable<number>;
}

export interface ContributionsGroupBy {
    occupation?: Nullable<Nullable<ContributionGroup>[]>;
    employer?: Nullable<Nullable<ContributionGroup>[]>;
    zipCode?: Nullable<Nullable<ContributionZipCode>[]>;
    individual?: Nullable<Nullable<ContributionContributor>[]>;
}

export interface ContributionsSumByLocation {
    inDistrict?: Nullable<number>;
    inCity?: Nullable<number>;
    inCounty?: Nullable<number>;
    inState?: Nullable<number>;
    outOfState?: Nullable<number>;
}

export interface ContributionsSumByCode {
    ind?: Nullable<number>;
    com?: Nullable<number>;
    oth?: Nullable<number>;
    pty?: Nullable<number>;
    scc?: Nullable<number>;
}

export interface ContributionsSumByMethod {
    inKind?: Nullable<number>;
    individual?: Nullable<number>;
    other?: Nullable<number>;
    monetary?: Nullable<ContributionsSumByCode>;
    nonMonetary?: Nullable<ContributionsSumByCode>;
}

export interface ContributionsSumByJurisdiction {
    inside?: Nullable<number>;
    outside?: Nullable<number>;
}

export interface ContributionsSumBy {
    jurisdiction?: Nullable<ContributionsSumByJurisdiction>;
    method?: Nullable<ContributionsSumByMethod>;
    location?: Nullable<ContributionsSumByLocation>;
}

export interface ElectionYear {
    year?: Nullable<string>;
    elections?: Nullable<Nullable<Election>[]>;
    candidates?: Nullable<Nullable<Candidate>[]>;
    candidateCount?: Nullable<number>;
    officesByType?: Nullable<OfficesByType>;
}

export interface Election {
    date?: Nullable<string>;
    type?: Nullable<ElectionType>;
}

export interface ExpensesGroupBy {
    expenseByCode?: Nullable<Nullable<ExpenseGroup>[]>;
}

export interface ExpenseGroup {
    code?: Nullable<string>;
    sum?: Nullable<number>;
    percent?: Nullable<number>;
    count?: Nullable<number>;
}

export interface Expenses {
    sum?: Nullable<number>;
    groupBy?: Nullable<ExpensesGroupBy>;
}

export interface IndependentExpendituresByCommittees {
    support?: Nullable<Nullable<IndependentExpenditureCommittee>[]>;
    oppose?: Nullable<Nullable<IndependentExpenditureCommittee>[]>;
}

export interface IndependentExpenditureCommittee {
    committee?: Nullable<Committee>;
    sum?: Nullable<number>;
}

export interface IndependentExpenditureSums {
    support?: Nullable<number>;
    oppose?: Nullable<number>;
}

export interface IndependentExpenditures {
    candidateName?: Nullable<string>;
    electionYear?: Nullable<string>;
    sums?: Nullable<IndependentExpenditureSums>;
    committees?: Nullable<IndependentExpendituresByCommittees>;
}

export interface LastUpdate {
    dateTime?: Nullable<string>;
}

export interface Office {
    title?: Nullable<string>;
    electionYear?: Nullable<string>;
    totalContributions?: Nullable<number>;
    committeeCount?: Nullable<number>;
    candidates?: Nullable<Nullable<Candidate>[]>;
}

export interface OfficesByType {
    mayor?: Nullable<Office>;
    cityCouncil?: Nullable<Office>;
    cityAttorney?: Nullable<Office>;
}

type Nullable<T> = T | null;
