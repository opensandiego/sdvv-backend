import {MigrationInterface, QueryRunner} from "typeorm";

export class SetFilerIdToOptionalExpnRcpt1652055940192 implements MigrationInterface {
    name = 'SetFilerIdToOptionalExpnRcpt1652055940192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "expn"
            ALTER COLUMN "filer_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "rcpt"
            ALTER COLUMN "filer_id" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "rcpt"
            ALTER COLUMN "filer_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "expn"
            ALTER COLUMN "filer_id"
            SET NOT NULL
        `);
    }

}
