import {MigrationInterface, QueryRunner} from "typeorm";

export class CandidateAddInPrimaryColumn1648420913330 implements MigrationInterface {
    name = 'CandidateAddInPrimaryColumn1648420913330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "candidate"
            ADD "in_primary_election" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "candidate" DROP COLUMN "in_primary_election"
        `);
    }

}
