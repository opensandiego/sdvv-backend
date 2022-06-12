import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableS4961654992811319 implements MigrationInterface {
    name = 'createTableS4961654992811319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "s496" (
                "id" SERIAL NOT NULL,
                "filer_id" character varying,
                "rpt_id_num" character varying NOT NULL,
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
                "amount" numeric NOT NULL,
                "exp_date" character varying NOT NULL,
                "date_thru" character varying,
                "expn_dscr" character varying NOT NULL,
                "supp_opp_cd" character varying NOT NULL,
                "bal_name" character varying,
                "bal_num" character varying,
                "bal_juris" character varying,
                "cand_naml" character varying NOT NULL,
                "cand_namf" character varying,
                "cand_namt" character varying,
                "cand_nams" character varying,
                "office_cd" character varying,
                "office_dscr" character varying,
                "dist_no" character varying,
                "juris_cd" character varying,
                "juris_dscr" character varying,
                "memo_code" boolean,
                "memo_refno" character varying,
                "xlsx_file_year" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_f5720be46f78c67782ada7439bc" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "s496"
        `);
    }

}
