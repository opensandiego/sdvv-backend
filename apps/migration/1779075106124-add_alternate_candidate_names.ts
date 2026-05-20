import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAlternateCandidateNames1779075106124 implements MigrationInterface {
    name = 'AddAlternateCandidateNames1779075106124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" ADD "alternate_candidate_names" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate" DROP COLUMN "alternate_candidate_names"`);
    }

}
