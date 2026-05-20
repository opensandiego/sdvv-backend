import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCandidateToExpendituresRelations1779126022805 implements MigrationInterface {
    name = 'AddCandidateToExpendituresRelations1779126022805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s496" ADD "candidateSuppOppCandidateId" character varying`);
        await queryRunner.query(`ALTER TABLE "expn" ADD "candidateSuppOppCandidateId" character varying`);
        await queryRunner.query(`ALTER TABLE "s496" ADD CONSTRAINT "FK_c8867c273d34f300485d6e43ec3" FOREIGN KEY ("candidateSuppOppCandidateId") REFERENCES "candidate"("candidate_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expn" ADD CONSTRAINT "FK_7f41e8ded14780c40201dd40924" FOREIGN KEY ("candidateSuppOppCandidateId") REFERENCES "candidate"("candidate_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expn" DROP CONSTRAINT "FK_7f41e8ded14780c40201dd40924"`);
        await queryRunner.query(`ALTER TABLE "s496" DROP CONSTRAINT "FK_c8867c273d34f300485d6e43ec3"`);
        await queryRunner.query(`ALTER TABLE "expn" DROP COLUMN "candidateSuppOppCandidateId"`);
        await queryRunner.query(`ALTER TABLE "s496" DROP COLUMN "candidateSuppOppCandidateId"`);
    }

}
