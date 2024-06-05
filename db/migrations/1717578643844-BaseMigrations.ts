import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717578643844 implements MigrationInterface {
    name = 'BaseMigrations1717578643844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site_options" ALTER COLUMN "group" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site_options" ALTER COLUMN "group_title" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site_options" ALTER COLUMN "group_title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "site_options" ALTER COLUMN "group" SET NOT NULL`);
    }

}
