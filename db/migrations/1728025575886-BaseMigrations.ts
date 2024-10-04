import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1728025575886 implements MigrationInterface {
    name = 'BaseMigrations1728025575886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "search_engine" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "search_engine"`);
    }

}
