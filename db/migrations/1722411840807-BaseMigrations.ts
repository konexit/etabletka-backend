import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1722411840807 implements MigrationInterface {
    name = 'BaseMigrations1722411840807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "attributes" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "attributes"`);
    }

}
