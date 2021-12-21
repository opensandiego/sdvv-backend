import {MigrationInterface, QueryRunner} from "typeorm";

export class InitializeDatabase1640128998992 implements MigrationInterface {
    name = 'InitializeDatabase1640128998992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "candidate" (
                "filer_id" character varying NOT NULL,
                "office_id" character varying NOT NULL,
                "first_name" character varying NOT NULL,
                "middle_name" character varying,
                "last_name" character varying NOT NULL,
                "title" character varying,
                "suffix" character varying,
                "office" character varying NOT NULL,
                "office_code" character varying NOT NULL,
                "jurisdiction_id" character varying NOT NULL,
                "district" character varying,
                "agency" character varying NOT NULL,
                "jurisdiction_type" character varying NOT NULL,
                "jurisdiction_name" character varying NOT NULL,
                "jurisdiction_code" character varying NOT NULL,
                "candidate_name" character varying NOT NULL,
                "candidate_controlled_committee_name" character varying,
                "full_office_name" character varying NOT NULL,
                "election_year" character varying NOT NULL,
                "candidate_id" character varying NOT NULL,
                "in_general_election" boolean NOT NULL DEFAULT false,
                "description" character varying,
                "image_url" character varying,
                "website" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_6631a6b2fce3dc70f29f031bc12" PRIMARY KEY ("candidate_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "committee" (
                "entity_id" character varying NOT NULL,
                "entity_name" character varying NOT NULL,
                "entity_name_lower" character varying NOT NULL,
                "entity_type" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_df2b01e240e3ecce7ac6d880b6d" PRIMARY KEY ("entity_id", "entity_name_lower")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "election" (
                "election_date" character varying NOT NULL,
                "election_id" character varying NOT NULL,
                "election_type" character varying NOT NULL,
                "internal" boolean NOT NULL,
                "transactions_last_update" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_cf7758224451c27b8eb821ee21c" UNIQUE ("election_date"),
                CONSTRAINT "PK_7925d4c5dd6f7170aed6c2744ac" PRIMARY KEY ("election_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "expn" (
                "id" SERIAL NOT NULL,
                "filer_id" character varying NOT NULL,
                "filer_naml" character varying NOT NULL,
                "report_num" character varying NOT NULL,
                "e_filing_id" character varying NOT NULL,
                "orig_e_filing_id" character varying NOT NULL,
                "cmtte_type" character varying NOT NULL,
                "rpt_date" character varying NOT NULL,
                "from_date" character varying NOT NULL,
                "thru_date" character varying NOT NULL,
                "elect_date" character varying,
                "rec_type" character varying NOT NULL,
                "form_type" character varying NOT NULL,
                "tran_id" character varying NOT NULL,
                "entity_cd" character varying,
                "payee_naml" character varying,
                "payee_namf" character varying,
                "payee_namt" character varying,
                "payee_nams" character varying,
                "payee_adr1" character varying,
                "payee_adr2" character varying,
                "payee_city" character varying,
                "payee_st" character varying,
                "payee_zip4" character varying,
                "expn_date" character varying,
                "amount" numeric NOT NULL,
                "cum_ytd" numeric,
                "expn_code" character varying,
                "expn_dscr" character varying,
                "agent_naml" character varying,
                "agent_namf" character varying,
                "agent_namt" character varying,
                "agent_nams" character varying,
                "cmte_id" character varying,
                "tres_naml" character varying,
                "tres_namf" character varying,
                "tres_namt" character varying,
                "tres_nams" character varying,
                "tres_adr1" character varying,
                "tres_adr2" character varying,
                "tres_city" character varying,
                "tres_st" character varying,
                "tres_zip4" character varying,
                "cand_naml" character varying,
                "cand_namf" character varying,
                "cand_namt" character varying,
                "cand_nams" character varying,
                "office_cd" character varying,
                "office_dscr" character varying,
                "juris_cd" character varying,
                "juris_dscr" character varying,
                "dist_no" character varying,
                "off_s_h_cd" character varying,
                "bal_name" character varying,
                "bal_num" character varying,
                "bal_juris" character varying,
                "supp_opp_cd" character varying,
                "memo_code" boolean NOT NULL,
                "memo_refno" character varying,
                "bakref_tid" character varying,
                "g_from_e_f" character varying,
                "xref_schnm" character varying,
                "xref_match" character varying,
                "xlsx_file_year" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_dbd8667be5655df4107a602d559" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "rcpt" (
                "id" SERIAL NOT NULL,
                "filer_id" character varying NOT NULL,
                "filer_naml" character varying NOT NULL,
                "report_num" character varying NOT NULL,
                "e_filing_id" character varying NOT NULL,
                "orig_e_filing_id" character varying NOT NULL,
                "cmtte_type" character varying,
                "rpt_date" character varying NOT NULL,
                "from_date" character varying,
                "thru_date" character varying,
                "elect_date" character varying,
                "rec_type" character varying NOT NULL,
                "form_type" character varying NOT NULL,
                "tran_id" character varying NOT NULL,
                "entity_cd" character varying NOT NULL,
                "ctrib_naml" character varying NOT NULL,
                "ctrib_namf" character varying,
                "ctrib_namt" character varying,
                "ctrib_nams" character varying,
                "ctrib_adr1" character varying,
                "ctrib_adr2" character varying,
                "ctrib_city" character varying,
                "ctrib_st" character varying,
                "ctrib_zip4" character varying,
                "ctrib_emp" character varying,
                "ctrib_occ" character varying,
                "ctrib_self" boolean NOT NULL,
                "tran_type" character varying,
                "rcpt_date" character varying NOT NULL,
                "date_thru" character varying,
                "amount" numeric NOT NULL,
                "cum_ytd" numeric,
                "ctrib_dscr" character varying,
                "cmte_id" character varying,
                "tres_naml" character varying,
                "tres_namf" character varying,
                "tres_namt" character varying,
                "tres_nams" character varying,
                "tres_adr1" character varying,
                "tres_adr2" character varying,
                "tres_city" character varying,
                "tres_st" character varying,
                "tres_zip4" character varying,
                "intr_naml" character varying,
                "intr_namf" character varying,
                "intr_namt" character varying,
                "intr_nams" character varying,
                "intr_adr1" character varying,
                "intr_adr2" character varying,
                "intr_city" character varying,
                "intr_st" character varying,
                "intr_zip4" character varying,
                "intr_emp" character varying,
                "intr_occ" character varying,
                "intr_self" boolean NOT NULL,
                "memo_code" boolean NOT NULL,
                "memo_refno" character varying,
                "bakref_tid" character varying,
                "xref_schnm" character varying,
                "xref_match" character varying,
                "int_rate" character varying,
                "int_cmteid" character varying,
                "xlsx_file_year" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_dca515d15a33ba6cf8dc6adda1b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "jurisdiction" (
                "city" character varying NOT NULL,
                "type" character varying NOT NULL,
                "name" character varying NOT NULL,
                "zipCodes" text array NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5f6f56ec723ba10a66c87c2e30b" PRIMARY KEY ("name")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "zipCode" (
                "zip" character varying NOT NULL,
                "type" character varying NOT NULL,
                "decommissioned" character varying NOT NULL,
                "primary_city" character varying NOT NULL,
                "acceptable_cities" character varying,
                "unacceptable_cities" character varying,
                "state" character varying NOT NULL,
                "county" character varying,
                "timezone" character varying,
                "area_codes" character varying,
                "world_region" character varying NOT NULL,
                "country" character varying NOT NULL,
                "latitude" character varying NOT NULL,
                "longitude" character varying NOT NULL,
                "irs_estimated_population_2015" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_95a7f2e103fe027d6fffed71092" PRIMARY KEY ("zip")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "zipCode"
        `);
        await queryRunner.query(`
            DROP TABLE "jurisdiction"
        `);
        await queryRunner.query(`
            DROP TABLE "rcpt"
        `);
        await queryRunner.query(`
            DROP TABLE "expn"
        `);
        await queryRunner.query(`
            DROP TABLE "election"
        `);
        await queryRunner.query(`
            DROP TABLE "committee"
        `);
        await queryRunner.query(`
            DROP TABLE "candidate"
        `);
    }

}
