import { MigrationInterface, QueryRunner } from "typeorm";

export class SetSuppOppNullable1672654964945 implements MigrationInterface {
    name = 'SetSuppOppNullable1672654964945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s496" ALTER COLUMN "supp_opp_cd" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s496" ALTER COLUMN "supp_opp_cd" SET NOT NULL`);
    }

}
