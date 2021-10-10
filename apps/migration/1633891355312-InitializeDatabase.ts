import {MigrationInterface, QueryRunner} from "typeorm";

export class InitializeDatabase1633891355312 implements MigrationInterface {
    name = 'InitializeDatabase1633891355312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "transaction" (
                "filing_id" character varying NOT NULL,
                "tran_id" character varying NOT NULL,
                "filer_name" character varying NOT NULL,
                "doc_public" character varying NOT NULL,
                "e_filing_id" character varying NOT NULL,
                "transaction_date" character varying NOT NULL,
                "amount" integer NOT NULL,
                "tx_type" character varying NOT NULL,
                "schedule" character varying NOT NULL,
                "filing_type" character varying NOT NULL,
                "name" character varying NOT NULL,
                "intr_name" character varying,
                "city" character varying,
                "state" character varying,
                "zip" character varying,
                "spending_code" character varying,
                "employer" character varying,
                "occupation" character varying,
                "transaction_date_time" character varying NOT NULL,
                "zip5" character varying,
                "sup_opp_cd" character varying,
                "has_been_processed" boolean NOT NULL DEFAULT false,
                "include_in_calculations" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_279c09e77c51e39da6087d9d8ae" PRIMARY KEY ("filing_id", "tran_id", "schedule")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "candidate" (
                "coe_id" character varying NOT NULL,
                "filer_id" character varying NOT NULL,
                "office_id" character varying NOT NULL,
                "election_id" character varying NOT NULL,
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
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_49808b6a33514b781fb563bcc20" PRIMARY KEY ("coe_id")
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
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_cf7758224451c27b8eb821ee21c" UNIQUE ("election_date"),
                CONSTRAINT "PK_7925d4c5dd6f7170aed6c2744ac" PRIMARY KEY ("election_id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "filing" (
                "filing_id" character varying NOT NULL,
                "doc_public" character varying,
                "period_end" character varying,
                "filing_type" character varying NOT NULL,
                "e_filing_id" character varying NOT NULL,
                "filing_date" character varying NOT NULL,
                "amendment" boolean NOT NULL,
                "amends_orig_id" character varying,
                "amends_prev_id" character varying,
                "amendment_number" integer NOT NULL,
                "filing_subtypes" character varying,
                "entity_name" character varying NOT NULL,
                "filing_date_time" character varying NOT NULL,
                "enabled" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_3ba24bab691783e6651ff6650cb" PRIMARY KEY ("filing_id")
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
        await queryRunner.query(`
            CREATE VIEW "calcTransaction" AS
            SELECT *
            FROM "transaction" "TransactionEntity"
            WHERE include_in_calculations IS TRUE
        `);
        await queryRunner.query(`
            INSERT INTO "typeorm_metadata"("type", "schema", "name", "value")
            VALUES ($1, $2, $3, $4)
        `, ["VIEW","public","calcTransaction","SELECT * FROM \"transaction\" \"TransactionEntity\" WHERE include_in_calculations IS TRUE"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "typeorm_metadata"
            WHERE "type" = $1
                AND "schema" = $2
                AND "name" = $3
        `, ["VIEW","public","calcTransaction"]);
        await queryRunner.query(`
            DROP VIEW "calcTransaction"
        `);
        await queryRunner.query(`
            DROP TABLE "zipCode"
        `);
        await queryRunner.query(`
            DROP TABLE "jurisdiction"
        `);
        await queryRunner.query(`
            DROP TABLE "filing"
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
        await queryRunner.query(`
            DROP TABLE "transaction"
        `);
    }

}
