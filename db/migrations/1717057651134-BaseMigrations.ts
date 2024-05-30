import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717057651134 implements MigrationInterface {
    name = 'BaseMigrations1717057651134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "country_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "region_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "district_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "community_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "prefix" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "prefix" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "community_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "district_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "region_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cities" ALTER COLUMN "country_id" SET NOT NULL`);
    }

}
