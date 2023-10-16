import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedRptIdNumS4961697495220599 implements MigrationInterface {
    name = 'ChangedRptIdNumS4961697495220599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s496" ALTER COLUMN "rpt_id_num" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s496" ALTER COLUMN "rpt_id_num" SET NOT NULL`);
    }

}
