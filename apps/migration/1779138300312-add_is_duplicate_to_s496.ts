import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDuplicateToS4961779138300312 implements MigrationInterface {
    name = 'AddIsDuplicateToS4961779138300312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s496" ADD "is_duplicate" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "s496" DROP COLUMN "is_duplicate"`);
    }

}
