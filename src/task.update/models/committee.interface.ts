export interface Committee {
  entity_id: string;
  entity_name: string;
  entity_name_lower: string;
  entity_type: string;
}

export interface CommitteeList {
  committee_list: Committee[];
}

export interface EFileCommitteeResponse {
  data: CommitteeList[];
}
